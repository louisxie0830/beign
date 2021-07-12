const Boom = require("@hapi/boom");
const Uuidv4 = require("uuid/v4");
const Moment = require("moment");
const OSS = require("../libs/oss");
const Fs = require("fs");
const Crypto = require("crypto");
const ErrorCodes = require("../libs/errorCodes");
const Send = require("../libs/mailer");
const Sign = require("../libs/sign");
const PdfUtil = require("../libs/pdf-util");
const Signing = require("./signing");
const QueryLetter = require("./dao");
const Path = require("path");
const cryptUtil = require("../libs/crypt-util");
const sendSMS = require("../libs/sms-util");
const { Op } = require("sequelize");
const sendMail = require("../libs/sendMail");
// const { uniqBy } = require("lodash");

module.exports = {
  notImplemented: async request => {
    throw Boom.notImplemented("not implemented");
  },
  withdrawLetter: async (request, h) => {
    const pool = await request.mysql.pool.getConnection();
    await pool.beginTransaction();
    const lang = request.getLocale(); // 获取语系
    try {
      const signature = request.headers.signature;
      const address = request.headers.address;
      const comment = request.payload.comment || "";
      const letterId = request.payload.letterId;
      const companyId = request.payload.corpId;
      const currentUserId = request.auth.credentials.userId;
      const queryUserSql = "select * from user where id = ? and status = 1";
      const [userRow] = await pool.query(queryUserSql, [currentUserId]);
      if (!userRow || !userRow[0]) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"] // 'SIGN_FAIL'
        };
      }
      const queryLetterSql = "select * from letter where id = ?";
      const [queryLetter] = await pool.query(queryLetterSql, [letterId]);
      const letter = queryLetter[0];
      if (!letter) {
        return {
          code: 94001,
          message: ErrorCodes[lang]["94001"]
        };
      }

      if (letter.status !== 2) {
        return {
          code: 94002,
          message: ErrorCodes[lang]["94002"]
        };
      }
      if (letter.expired_time && letter.expired_time - Date.now() <= 0) {
        return {
          code: 94003,
          message: ErrorCodes[lang]["94003"]
        };
      }
      if (letter.sender_id !== currentUserId) {
        return {
          code: 94005,
          message: ErrorCodes[lang]["94005"] // 'SIGN_FAIL'
        };
      }
      // const queryCurrentReceiverSql = "select * from letter_receiver where user_id = ? and is_signing = 2 and letter_id = ? and type = 1 limit 1";
      // const [queryCurrentReceiver] = await pool.query(queryCurrentReceiverSql, [currentUserId, letterId]);
      // const currentReceiver = queryCurrentReceiver[0];
      // if (!currentReceiver) {
      //   return {
      //     code: 94005,
      //     message: ErrorCodes[lang]['94005'] //'SIGN_FAIL'
      //   };
      // }
      // if (currentReceiver.is_signing !== 1) {
      //   return {
      //     code: 94005,
      //     message: ErrorCodes[lang]['94005'] //'SIGN_FAIL'
      //   };
      // }
      let companyName = "";
      // 如果选择了公司，代表公司签署，要先获取授权公司列表，判断当前companyId是否在其中，有的话才能签署
      if (companyId !== 0) {
        const queryCompanyList =
          "select * from company_authorized where user_id = ? and company_id = ? and status = 1";
        const [companyRow] = await pool.query(queryCompanyList, [
          currentUserId,
          companyId
        ]);
        if (!companyRow || companyRow.length <= 0) {
          return {
            code: 94005,
            message: ErrorCodes[lang]["94005"] // 'SIGN_FAIL'
          };
        }
        companyName = companyRow[0].name || "";
      }

      // 执行签署
      await Sign(pool, {
        target_type: 2,
        target_id: letterId,
        signer_id: currentUserId,
        signer_address: address,
        message: request.payload,
        signature: signature,
        payload: "WITHDRAW",
        signer_company_id: companyId
      });
      const updateReceiverStatusSql =
        "update letter_receiver set is_signing = 1, receiver_company_id = ? where letter_id = ? and user_id = ? and (type = 1 or type = 3)";
      await pool.execute(updateReceiverStatusSql, [
        companyId,
        letterId,
        currentUserId
      ]);
      const updateLetterStatusSql =
        "update letter set withdraw_time = ?, comment = ?, status = 1 where id = ?";
      await pool.execute(updateLetterStatusSql, [
        new Date(),
        comment,
        letterId
      ]);
      // 查当前用户名
      const [
        userNameRow
      ] = await pool.execute("select name, email from user where id = ?", [
        currentUserId
      ]);
      const userName = userNameRow[0].name;
      const userEmail = userNameRow[0].email;
      // 查询file个数
      const [
        lengthRow
      ] = await pool.execute(
        "select COUNT(1) number from letter_file where letter_id = ?",
        [letterId]
      );
      // 发送邮件给当前用户（即发起人）
      Send.withdrawEmail(
        userEmail,
        lang,
        userName,
        companyName,
        letter.title,
        lengthRow[0].number,
        letter.message,
        comment
      );
      // 发送邮件给阅览人
      const viewerListSql =
        "select `email` from letter_receiver where letter_id = ? and type = 2";
      const [viewerListRow] = await pool.execute(viewerListSql, [letterId]);
      if (viewerListRow && viewerListRow.length > 0) {
        viewerListRow.map(item => {
          Send.withdrawEmail(
            item.email,
            lang,
            userName,
            companyName,
            letter.title,
            lengthRow[0].number,
            letter.message,
            comment
          );
        });
      }
      // 发送邮件给同意签署的人
      const signListSql =
        "select `email` from letter_receiver where letter_id = ? and (type = 1 or type = 3) and is_signing = 3";
      const [signListRow] = await pool.execute(signListSql, [letterId]);
      if (signListRow && signListRow.length > 0) {
        signListRow.map(item => {
          Send.withdrawEmail(
            item.email,
            lang,
            userName,
            companyName,
            letter.title,
            lengthRow[0].number,
            letter.message,
            comment
          );
        });
      }

      await pool.commit();
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      await pool.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  },
  signLetter: async (request, h) => {
    const lang = request.getLocale(); // 获取语系
    const signature = request.headers.signature;
    const address = request.headers.address;
    const letterId = request.payload.letterId;
    const companyId = request.payload.corpId;
    const comment = request.payload.comment || "";
    const currentUserId = request.auth.credentials.userId;
    const signatures = request.payload.signatures;
    const letterModel = request.getModel("letter");
    const UserModel = request.getModel("user");
    const LetterReceiverModel = request.getModel("letterReceiver");
    const LetterSignerSignatureModel = request.getModel(
      "letterSignerSignature"
    );
    const CompanyModel = request.getModel("company");
    const CompanyAuthorizedModel = request.getModel("companyAuthorized");
    const SignatureModel = request.getModel("signature");
    const SmsNotifyModel = request.getModel("smsNotify");
    const LetterFileModel = request.getModel("letterFile");
    const sequelize = request.getDb().sequelize;
    try {
      const userRow = await UserModel.findOne({ where: { id: currentUserId } });
      if (!userRow) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"] // 'SIGN_FAIL'
        };
      }
      const letter = await letterModel.findOne({ where: { id: letterId } });
      if (!letter) {
        return {
          code: 94001,
          message: ErrorCodes[lang]["94001"]
        };
      }

      if (letter.status !== 2) {
        return {
          code: 94007,
          message: ErrorCodes[lang]["94007"]
        };
      }
      if (letter.expiredTime && letter.expiredTime - Date.now() <= 0) {
        return {
          code: 94003,
          message: ErrorCodes[lang]["94003"]
        };
      }
      const currentReceiver = await LetterReceiverModel.findOne({
        where: {
          isSigning: 2,
          letterId: letterId,
          userId: currentUserId,
          [Op.or]: [{ type: 1 }, { type: 3 }]
        }
      });
      if (!currentReceiver) {
        return {
          code: 94005,
          message: ErrorCodes[lang]["94005"] // 'SIGN_FAIL'
        };
      }
      if (currentReceiver.receiverCompanyId !== companyId) {
        return {
          code: 94015,
          message: ErrorCodes[lang]["94015"]
        };
      }
      // 按顺序签
      if (currentReceiver.order !== letter.progress) {
        return {
          code: 94006,
          message: ErrorCodes[lang]["94006"]
        };
      }
      let companyName = "";
      // 如果选择了公司，代表公司签署，要先获取授权公司列表，判断当前companyId是否在其中，有的话才能签署
      if (companyId !== 0) {
        // 查公司名称
        const companyInfo = await CompanyModel.findOne({
          where: { id: companyId, status: 1 }
        });
        companyName = companyInfo.name || "";
        const companyRow = await CompanyAuthorizedModel.findAll({
          where: {
            companyId: companyId,
            userId: currentUserId,
            status: 1,
            role: 3
          }
        });
        if (!companyRow || companyRow.length <= 0) {
          return {
            code: 94005,
            message: ErrorCodes[lang]["94005"] // 'SIGN_FAIL'
          };
        }
      }

      let lastSigner = true; // 是否為最後一個簽署人，是最後一個表示完成簽署 true是最后一个，false不是最后一个
      let nextOrderEmail = null; // 下一位签署人的email
      // 发起人的信息
      let senderUserRow = await UserModel.findOne({
        where: { id: letter.senderId }
      });
      const NowTime = Moment()
        .utcOffset(480)
        .format("YYYY/MM/DD");
      const nowTime = new Date(); // 存数据库使用的当前时间  发送邮件和生成pdf
      const letterReceiveAllList = await LetterReceiverModel.findAll({
        where: {
          letterId: letterId
        },
        order: [["order", "ASC"]]
      });
      let userOrder = 0;
      const viewerListRow = [];
      const signerListRow = [];
      letterReceiveAllList.map(item => {
        if (item.type === 2) {
          viewerListRow.push(item);
        }
        if (item.type === 1 || item.type === 3) {
          signerListRow.push(item);
          if (item.userId === currentUserId) {
            userOrder = item.order;
          }
        }
      });
      // 有下一位签署人
      letterReceiveAllList.map(item => {
        if (
          (item.type === 1 || item.type === 3) &&
          item.order === userOrder + 1
        ) {
          lastSigner = false;
          nextOrderEmail = item.email;
        }
      });
      // 当前用户的名称
      const userName = userRow.name;
      // 查询file个数
      const letterFile = await LetterFileModel.findAll({
        where: { letterId: letter.id }
      });
      const letterLength = letterFile.length;
      const sendAllEmailList = [];
      const sendAllNameList = [];
      // 发起人邮箱push
      sendAllEmailList.push(senderUserRow.email);

      if (viewerListRow.length > 0) {
        viewerListRow.map(item => {
          if (lastSigner) {
            sendAllEmailList.push(item.email);
          }
        });
      }
      if (signerListRow.length > 0) {
        signerListRow.map(item => {
          sendAllEmailList.push(item.email);
          sendAllNameList.push({
            userId: item.userId,
            time: Moment(item.signTime || nowTime)
              .utcOffset(480)
              .format("YYYY-MM-DD HH:mm:ss"),
            type: item.type
          });
        });
      }
      // 根据email查name
      const userList = await UserModel.findAll({
        where: {
          email: {
            [Op.in]: sendAllEmailList
          }
        }
      });
      const userNameMap = {};
      userList.map(item => {
        userNameMap[item.id] = item.name;
      });
      const allNameList = sendAllNameList.map(item => {
        item.name = userNameMap[item.userId];
        return item;
      });
      const signerList = [];
      const approverList = [];
      // const uniqNameList = uniqBy(allNameList, "user_id");
      console.log("allNameList：", allNameList);
      allNameList.map(item => {
        if (item.type === 1) {
          signerList.push({
            name: item.name,
            time: item.time
          });
        } else {
          approverList.push({
            name: item.name,
            time: item.time
          });
        }
      });
      console.log("签署人and同意人：", signerList, approverList);

      // 签署完成，更新完成时间
      if (lastSigner) {
        letter.completeTime = nowTime;
      }
      if (lastSigner) {
        letter.status = 3;
      } else {
        letter.progress = letter.progress + 1;
      }
      await sequelize.transaction(async transaction => {
        await letter.save({ transaction });
        if (signatures && signatures.length > 0) {
          const signerSignature = signatures.map(i => {
            return {
              letterId: letterId,
              letterFileKey: i.fileUrl,
              userId: currentUserId,
              pageNo: i.page,
              positionX: i.pageOffsetX,
              positionY: i.pageOffsetY,
              color: i.color,
              pngContent: i.content
            };
          });
          await LetterSignerSignatureModel.bulkCreate(signerSignature, {
            transaction
          });
        }
        // 执行签署
        await SignatureModel.create(
          {
            targetType: 2,
            targetId: letterId,
            signerId: currentUserId,
            signerAddress: address,
            message: JSON.stringify(request.payload),
            signature: signature,
            payload: currentReceiver.type === 1 ? "SIGN" : "APPROVAL",
            signerCompanyId: companyId
          },
          { transaction }
        );
        await LetterReceiverModel.update(
          {
            signTime: nowTime,
            comment: comment,
            isSigning: 3,
            receiverCompanyId: companyId
          },
          {
            where: {
              letterId: letterId,
              userId: currentUserId,
              [Op.or]: [{ type: 1 }, { type: 3 }]
            },
            transaction
          }
        );
      });

      if (letter.emailSwitch) {
        // 判断签署完成
        if (!lastSigner) {
          // 同意签署之后发送邮件 发送给下一位签署人和发起人 如果已完成 则发给发起人、阅览人、所有签署人
          // 最新需求，没有签署完成，不用发给阅览人
          // if (viewerListRow && viewerListRow.length > 0) {
          //   viewerListRow.map(item => {
          //     Send.signSendEmail(
          //       item.email,
          //       lang,
          //       true,
          //       userName,
          //       companyName,
          //       letter.title,
          //       letterLength,
          //       letter.message,
          //       currentReceiver.type
          //     );
          //   });
          // }
          // 发送邮件给发起人
          Send.signSendEmail(
            senderUserRow.email,
            lang,
            true,
            userName,
            companyName,
            letter.title,
            letterLength,
            letter.message,
            currentReceiver.type
          );
          // 发送邮件给下一位签署人
          Send.signSendEmail(
            nextOrderEmail,
            lang,
            true,
            userName,
            companyName,
            letter.title,
            letterLength,
            letter.message,
            currentReceiver.type
          );
        } else {
          const letterReceiver = letterReceiveAllList.map(item => {
            item.signTime = item.signTime || nowTime;
            return item;
          });
          Send.signCompleteSendEmail(
            sendAllEmailList,
            signerList,
            approverList,
            letter,
            lang,
            senderUserRow.name,
            companyName,
            {
              currentUserId,
              letterReceiver,
              userList,
              letterFile,
              nowTime
            }
          );
        }
      }
      // 完成签署  发送简讯给发起人
      if (letter.enableSmsNotify && lastSigner) {
        const smsStr = `致 ${senderUserRow.name} 先生/小姐，您於 ${NowTime} 建立的 ${letter.title} ，已完成簽署，請登入 https://app.beingsign.com 確認訊息。`;
        const smsRes = sendSMS.sendSMS(senderUserRow.mobileVerify, smsStr);
        await SmsNotifyModel.create({
          letterId,
          smsId: smsRes.msgid,
          smsContent: smsStr,
          receiver: senderUserRow.mobileVerify,
          sendAt: "2019-09-08",
          status: 1
        });
        console.log("mobile: ", senderUserRow.mobileVerify);
      }
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  createLetter: async (request, h) => {
    const lang = request.getLocale(); // 获取语系
    const UserModel = request.getModel("user");
    const CompanyAuthorizedModel = request.getModel("companyAuthorized");
    const CompanyModel = request.getModel("company");
    const LetterModel = request.getModel("letter");
    const LetterSignerSignatureModel = request.getModel(
      "letterSignerSignature"
    );
    const ContactModel = request.getModel("contact");
    const LetterReceiverModel = request.getModel("letterReceiver");
    const LetterFileModel = request.getModel("letterFile");
    const LetterTagModel = request.getModel("letterTag");
    const TagModel = request.getModel("tag");
    const SignatureModel = request.getModel("signature");
    const sequelize = request.getDb().sequelize;
    try {
      const payload = request.payload;
      const companyId = payload.corpId;
      const currentUserId = request.auth.credentials.userId;
      const emailSwitch = payload.emailSwitch ? 1 : 0; // 1 发送邮件通知， 0不发
      const smsNotify = payload.smsNotify;
      const title = payload.title;
      const message = payload.message;
      const user = await UserModel.findOne({
        where: {
          id: currentUserId,
          status: 1
        }
      });
      let companyInfo = null;
      let viewerList = null;
      let signerList = null;
      if (!user) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      if (companyId !== 0) {
        const companyAuthRow = await CompanyAuthorizedModel.findAll({
          where: {
            userId: currentUserId,
            companyId,
            role: 3,
            status: 1
          }
        });
        if (companyAuthRow.length <= 0) {
          return {
            code: 94011,
            message: ErrorCodes[lang]["94011"]
          };
        }
        companyInfo = await CompanyModel.findOne({
          where: { id: companyId }
        });
        if (!companyInfo) {
          return {
            code: 94011,
            message: ErrorCodes[lang]["94011"]
          };
        }
        if (companyInfo.signing_remain <= 0) {
          return {
            code: 94012,
            message: ErrorCodes[lang]["94012"]
          };
        }
      } else {
        const USER_LIMIT = process.env.CONFIG_USER_CREATE_LIMIT || -1;
        const USER_LIMIT_DURATION_DAYS =
          process.env.CONFIG_USER_CREATE_LIMIT_DURATION_DAYS || 0;
        const startTime = Moment()
          .add(0 - USER_LIMIT_DURATION_DAYS, "day")
          .toDate();
        const userCount = await LetterModel.count({
          where: {
            senderId: currentUserId,
            createTime: {
              [Op.gt]: startTime
            }
          }
        });
        if (userCount >= USER_LIMIT) {
          return {
            code: 94012,
            message: ErrorCodes[lang]["94012"]
          };
        }
      }
      await sequelize.transaction(async transaction => {
        if (companyId !== 0) {
          await CompanyModel.update(
            { signingRemain: companyInfo.signingRemain - 1 },
            { where: { id: companyInfo.id }, transaction }
          );
        }
        const duteDate =
          payload.duteDate && payload.duteDate.getTime() > 0
            ? payload.duteDate
            : null;

        const insertLetter = await LetterModel.create(
          {
            uuid: Uuidv4(),
            senderId: currentUserId,
            companyId,
            title: title,
            message,
            progress: 1,
            status: 2,
            cancelerId: 0,
            emailSwitch: emailSwitch,
            createTime: new Date(),
            expiredTime: duteDate,
            enableSmsNotify: smsNotify
          },
          { transaction }
        );
        const letterId = insertLetter.id;
        if (payload.signerList && payload.signerList.length > 0) {
          await Promise.all(
            payload.signerList.map(i => {
              let email = i.email.toLowerCase();
              let contactName = i.name || email.slice(0, email.indexOf("@"));
              let contactEmail = email;
              return ContactModel.findOrCreate({
                where: {
                  ownerId: currentUserId,
                  [Op.or]: [{ contactEmail }, { contactName }]
                },
                defaults: {
                  uuid: Uuidv4(),
                  ownerId: currentUserId,
                  contactEmail,
                  contactName
                },
                transaction
              });
            })
          );
          signerList = await UserModel.findAll({
            where: {
              email: { [Op.in]: payload.signerList.map(i => i.email) }
            },
            transaction
          });
          let signers = payload.signerList.map((i, index) => {
            let userId = 0;
            let email = i.email.toLowerCase();
            let contactEmail = email;
            const signType = i.type === "SIGN" ? 1 : 3;
            let userIdRow = signerList.filter(
              item => item.email === contactEmail
            );
            if (userIdRow && userIdRow[0]) {
              userId = userIdRow[0].id;
            }

            return {
              uuid: Uuidv4(), // uuid:
              letterId, // letter_id:
              userId, // user_id:
              type: signType, // type:
              isSigning: 2, // is_signing:
              order: index + 1, // order:
              receiverCompanyId: i.corpId, // 公司id
              email: contactEmail, // email
              signTime: null, // sign_time:
              createTime: new Date(), // create_time:
              read: 0 // read
            };
          });
          if (payload.creatorSign) {
            signers = [
              {
                uuid: Uuidv4(), // uuid:
                letterId, // letter_id:
                userId: currentUserId, // user_id:
                type: payload.creatorSign, // type:
                isSigning: 3, // is_signing:
                order: 0, // order:
                receiverCompanyId: companyId, // 公司id
                email: user.email, // email
                signTime: new Date(), // sign_time
                createTime: new Date(), // create_time:
                read: 1 // read
              }
            ].concat(signers);
          }
          await LetterReceiverModel.bulkCreate(signers, { transaction });
        }

        if (payload.viewerList && payload.viewerList.length > 0) {
          await Promise.all(
            payload.viewerList.map(i => {
              let email = i.email.toLowerCase();
              let contactName = i.name || email.slice(0, email.indexOf("@"));
              let contactEmail = email;
              return ContactModel.findOrCreate({
                where: {
                  ownerId: currentUserId,
                  [Op.or]: [{ contactEmail }, { contactName }]
                },
                defaults: {
                  uuid: Uuidv4(),
                  ownerId: currentUserId,
                  contactEmail,
                  contactName
                },
                transaction
              });
            })
          );
          viewerList = await UserModel.findAll({
            where: {
              email: { [Op.in]: payload.viewerList.map(i => i.email) }
            }
          });
          const viewers = payload.viewerList.map((i, index) => {
            let email = i.email.toLowerCase();
            let contactEmail = email;
            let userId = 0;
            let userIdRow = viewerList.filter(
              item => item.email === contactEmail
            );
            if (userIdRow && userIdRow[0]) {
              userId = userIdRow[0].id;
            }

            const d = {
              uuid: Uuidv4(), // uuid:
              letterId, // letter_id:
              userId, // user_id:
              type: 2, // type:
              isSigning: 2, // is_signing:
              order: index + 1, // order:
              email: contactEmail, // email
              createTime: new Date() // create_time:
            };
            return d;
          });
          await LetterReceiverModel.bulkCreate(viewers, { transaction });
        }
        if (payload.fileList && payload.fileList.length > 0) {
          const signatures = [];
          const files = payload.fileList.map((i, index) => {
            const d = {
              uuid: Uuidv4(), // uuid:
              letterId, // letter_id:
              url: i.fileUrl, // url
              name: i.fileName, // name
              size: i.fileSize, // size
              type: i.fileType, // type
              hash: i.fileHash, // hash
              order: index + 1, // order
              createTime: new Date() // create_time
            };
            if (i.signature) {
              signatures.push({
                letterId: letterId,
                letterFileKey: i.fileUrl,
                userId: currentUserId,
                pageNo: i.signature.page,
                positionX: i.signature.pageOffsetX,
                positionY: i.signature.pageOffsetY,
                color: i.signature.color,
                pngContent: i.signature.content
              });
            }
            return d;
          });
          if (signatures && signatures.length > 0) {
            LetterSignerSignatureModel.bulkCreate(signatures, { transaction });
          }
          await LetterFileModel.bulkCreate(files, { transaction });
        }
        // 添加标签 关联到letter
        const tagNames = request.payload.tagNames;
        if (tagNames && tagNames.length > 0) {
          const tags = await Promise.all(
            tagNames.map(name => {
              return TagModel.findOrCreate({
                where: { userId: currentUserId, name, status: 1 },
                defaults: {
                  userId: currentUserId,
                  name,
                  createdAt: new Date()
                },
                transaction
              });
            })
          );
          const letterTag = tags.map(([t, created]) => {
            return { letterId, tagId: t.id };
          });
          console.log("create=>letterTag", letterTag);
          await LetterTagModel.bulkCreate(letterTag, { transaction });
        }

        const signature = request.headers.signature;
        const address = request.headers.address;
        // 执行签署
        const signatures = [
          {
            uuid: Uuidv4(),
            targetType: 2,
            targetId: letterId,
            signerId: currentUserId,
            signerAddress: address,
            message: JSON.stringify(request.payload),
            signature: signature,
            payload: "CREATE_LETTER",
            signerCompanyId: companyId,
            createTime: new Date(),
            status: 0,
            send: 0
          }
        ];
        if (payload.creatorSign) {
          // 执行签署
          signatures.push({
            uuid: Uuidv4(),
            targetType: 2,
            targetId: letterId,
            signerId: currentUserId,
            signerAddress: address,
            message: JSON.stringify(request.payload),
            signature: signature,
            payload: "SIGN",
            signerCompanyId: companyId,
            createTime: new Date(),
            status: 0,
            send: 0
          });
        }
        await SignatureModel.bulkCreate(signatures, { transaction });
      });
      const sEmail = user.email;

      const length = payload.fileList.length;
      console.log("create-->fileList.Lenght", length);
      if (companyId === 0) {
        // 个人 发起人
        Send.createrUserSendEmail(sEmail, length, title, message, lang);
        // 个人 签署人 阅览人
        if (signerList && signerList.length > 0) {
          payload.signerList.map(item => {
            const u = signerList.filter(i => i.email === item.email)[0];
            const langCode = (u && u.langCode) || lang;
            Send.signerUserSendEmail(
              item.email,
              length,
              title,
              user.name,
              message,
              langCode
            );
          });
        }
        if (viewerList && viewerList.length > 0) {
          payload.viewerList.map(item => {
            const u = viewerList.filter(i => i.email === item.email)[0];
            const langCode = (u && u.langCode) || lang;
            Send.signerUserSendEmail(
              item.email,
              length,
              title,
              user.name,
              message,
              langCode
            );
          });
        }
      } else {
        // 公司 发起
        Send.createrCompanySendEmail(
          sEmail,
          length,
          title,
          user.name,
          companyInfo.name,
          message,
          lang
        );
        // 公司 签署 阅览
        if (signerList && signerList.length > 0) {
          payload.signerList.map(item => {
            const u = signerList.filter(i => i.email === item.email)[0];
            const langCode = (u && u.langCode) || lang;
            Send.signerCompanySendEmail(
              item.email,
              length,
              title,
              user.name,
              companyInfo.name,
              message,
              langCode
            );
          });
        }
        if (payload.viewerList.length > 0) {
          payload.viewerList.map(item => {
            const u = viewerList.filter(i => i.email === item.email)[0];
            const langCode = (u && u.langCode) || lang;
            Send.signerCompanySendEmail(
              item.email,
              length,
              title,
              user.name,
              companyInfo.name,
              message,
              langCode
            );
          });
        }
      }
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("create_error", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  createLetterDraft: async (request, h) => {
    const pool = await request.mysql.pool.getConnection();
    await pool.beginTransaction();
    const lang = request.getLocale(); // 获取语系
    try {
      const payload = request.payload;
      const companyId = payload.corpId;
      const currentUserId = request.auth.credentials.userId;
      const emailSwitch = payload.emailSwitch ? 1 : 0; // 1 发送邮件通知， 0不发
      const smsNotify = payload.smsNotify;
      const fileList = JSON.stringify(payload.fileList) || "";
      const tagNames = JSON.stringify(payload.tagNames) || "";
      const viewerList = JSON.stringify(payload.viewerList) || "";
      const signerList = JSON.stringify(payload.signerList) || "";
      const title = payload.title || "";
      const duteDate =
        payload.duteDate && payload.duteDate.getTime() > 0
          ? payload.duteDate
          : null;
      const message = payload.message || "";
      const creatorSign = payload.creatorSign ? 1 : 0;
      const queryUserSql = "select * from user where id = ? and status = 1";
      const [userRow] = await pool.query(queryUserSql, [currentUserId]);
      const user = userRow[0];
      let companyInfo = null;
      if (!user) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      if (companyId !== 0) {
        const queryCompanyAuthList =
          "select * from company_authorized where user_id = ? and company_id = ? and role = 3 and status = 1";
        const [companyAuthRow] = await pool.query(queryCompanyAuthList, [
          currentUserId,
          companyId
        ]);
        if (companyAuthRow.length <= 0) {
          return {
            code: 94011,
            message: ErrorCodes[lang]["94011"]
          };
        }
        const queryCompanySql =
          "select * from company where id = ? and status = 1";
        const [companyRow] = await pool.query(queryCompanySql, [companyId]);
        companyInfo = companyRow[0];
        if (!companyInfo) {
          return {
            code: 94011,
            message: ErrorCodes[lang]["94011"]
          };
        }
        if (companyInfo.signing_remain <= 0) {
          return {
            code: 94012,
            message: ErrorCodes[lang]["94012"]
          };
        }
      }
      // 把原来的草稿删除 然后在插入新的草稿
      const delSql = "delete from `letter_draft` where sender_id = ? ";
      await pool.query(delSql, [currentUserId]);
      // 将所有数据存入草稿table
      const insertDraftSql =
        "insert into `letter_draft` (sender_id, company_id, title, message, email_switch, create_time, expired_time, creator_sign, letter_file, letter_signer, letter_viewer, tag_name,enable_sms_notify) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
      await pool.execute(insertDraftSql, [
        currentUserId,
        companyId,
        title,
        message,
        emailSwitch,
        new Date(),
        duteDate,
        creatorSign,
        fileList,
        signerList,
        viewerList,
        tagNames,
        smsNotify
      ]);
      await pool.commit();

      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("create_draft_error", e);
      await pool.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  },
  letterDraft: async (request, h) => {
    const pool = request.mysql.pool;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const queryUserSql = "select * from user where id = ? and status = 1";
    try {
      const [userRow] = await pool.query(queryUserSql, [currentUserId]);
      const user = userRow[0];
      if (!user) {
        return {
          code: 99001,
          message: ErrorCodes[lang]["99001"]
        };
      }
      const queryDraftSql = "select * from `letter_draft` where sender_id = ?";
      const [draftRow] = await pool.query(queryDraftSql, [currentUserId]);
      const draft = draftRow[0];
      if (!draft) {
        return {
          code: 200,
          message: "success",
          data: {}
        };
      }
      const fileList = draft.letter_file ? JSON.parse(draft.letter_file) : "";
      const tagNames = draft.tag_name ? JSON.parse(draft.tag_name) : "";
      const viewerList = draft.letter_viewer
        ? JSON.parse(draft.letter_viewer)
        : "";
      const signerList = draft.letter_signer
        ? JSON.parse(draft.letter_signer)
        : "";

      return {
        code: 200,
        message: "success",
        data: {
          fileList,
          tagNames,
          corpId: draft.company_id,
          emailSwitch: draft.email_switch,
          viewerList,
          signerList,
          title: draft.title,
          message: draft.message,
          duteDate: draft.expired_time,
          creatorSign: draft.creator_sign,
          smsNotify: draft.enable_sms_notify
        }
      };
    } catch (e) {
      console.log("letterDraft", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  postLetterDecline: async (request, h) => {
    const pool = request.mysql.pool;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const signature = request.headers.signature;
    const address = request.headers.address;
    const letterId = request.payload.letterId;
    const companyId = request.payload.corpId;
    const comment = request.payload.comment || "";
    const findLetterByLetterId = "SELECT * FROM letter where id = ?";
    const findReceiverByLetterId =
      "SELECT * FROM letter_receiver where letter_id = ? and user_id =? and (type = 1 or type = 3)";
    const queryUserSql = "select * from user where id = ? and status = 1";
    const [userRow] = await pool.query(queryUserSql, [currentUserId]);

    const currentUser = userRow[0];
    if (!currentUser) {
      return {
        code: 99001,
        message: ErrorCodes[lang]["99001"]
      };
    }
    const [letters] = await pool.query(findLetterByLetterId, [letterId]);
    const [receivers] = await pool.query(findReceiverByLetterId, [
      letterId,
      currentUserId
    ]);
    const letter = letters[0];
    const receiver = receivers[0];

    if (!letter) {
      return {
        code: 94001,
        message: ErrorCodes[lang]["94001"]
      };
    }

    if (!receiver) {
      return {
        code: 94006,
        message: ErrorCodes[lang]["94006"]
      };
    }
    // 未签
    if (receiver.is_signing !== 2) {
      return {
        code: 94007,
        message: ErrorCodes[lang]["94007"]
      };
    }
    // 未结束
    if (letter.status !== 2) {
      return {
        code: 94008,
        message: ErrorCodes[lang]["94008"]
      };
    }
    if (letter.expired_time && letter.expired_time - Date.now() <= 0) {
      return {
        code: 94003,
        message: ErrorCodes[lang]["94003"]
      };
    }
    if (receiver.receiver_company_id !== companyId) {
      return {
        code: 94015,
        message: ErrorCodes[lang]["94015"] // 'SIGN_FAIL'
      };
    }

    let companyName = "";

    if (companyId !== 0) {
      // 查公司名称
      const companyNameSql =
        "select `name` from company where id = ? and status = 1";
      const [companyNameRow] = await pool.query(companyNameSql, [companyId]);
      companyName = companyNameRow[0].name || "";
      // 如果选择了公司，代表公司签署，要先获取授权公司列表，判断当前companyId是否在其中，有的话才能签署
      const queryCompanyList =
        "select * from company_authorized where user_id = ? and company_id = ? and role = 3 and status = 1";
      const [companyRow] = await pool.query(queryCompanyList, [
        currentUserId,
        companyId
      ]);
      if (!companyRow || companyRow.length <= 0) {
        return {
          code: 94005,
          message: ErrorCodes[lang]["94005"] // 'SIGN_FAIL'
        };
      }
    }
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // 执行签署
      await Sign(conn, {
        target_type: 2,
        target_id: letterId,
        signer_id: currentUserId,
        signer_address: address,
        message: request.payload,
        signature: signature,
        payload: "DECLINE",
        signer_company_id: companyId
      });
      // update receiver
      // update letter
      const updateLetterSql = "update letter set status = 4 where id = ?";
      const updateLetterReceiver =
        "update letter_receiver set sign_time = ?, comment = ?, is_signing = 4, receiver_company_id = ? where letter_id=? and user_id =? and (type = 1 or type = 3)";
      await conn.query(updateLetterSql, [letter.id]);
      await conn.query(updateLetterReceiver, [
        new Date(),
        comment,
        companyId,
        letter.id,
        currentUserId
      ]);
      let mobile = null;
      let creatorEmail = null;
      let creatorName = null;
      if (letter.enable_sms_notify || letter.email_switch) {
        // 查詢發起人
        const sendEmailSql =
          "select email, name, mobile_verify from user where id = (select sender_id from letter where id = ?)";
        const [userRow] = await pool.query(sendEmailSql, [letter.id]);
        creatorEmail = userRow[0].email;
        mobile = userRow[0].mobile_verify;
        creatorName = userRow[0].name;
      }
      // 拒绝签署 拒绝之后发邮件给发起人 还要发给之前签署的人(如果有的话) 再发给阅览人
      if (letter.email_switch) {
        // 查询file个数
        const [
          lengthRow
        ] = await pool.query(
          "select COUNT(1) number from letter_file where letter_id = ?",
          [letter.id]
        );
        // 查当前用户名
        const [
          userNameRow
        ] = await pool.query("select name from user where id = ?", [
          currentUserId
        ]);
        const userName = userNameRow[0].name;
        // 发送邮件给发起人 用户拒绝签署
        Send.signSendEmail(
          creatorEmail,
          lang,
          false,
          userName,
          companyName,
          letter.title,
          lengthRow[0].number,
          letter.message,
          comment
        );

        // 发送邮件给阅览人
        const viewerListSql =
          "select `email` from letter_receiver where letter_id = ? and type = 2";
        const [viewerListRow] = await pool.query(viewerListSql, [letter.id]);
        if (viewerListRow && viewerListRow.length > 0) {
          viewerListRow.map(item => {
            Send.signSendEmail(
              item.email,
              lang,
              false,
              userName,
              companyName,
              letter.title,
              lengthRow[0].number,
              letter.message,
              comment
            );
          });
        }

        // 发送邮件给前面所有同意签署的人 如果没有就不发
        const orderSql =
          "select `order` from letter_receiver where letter_id = ? and user_id = ? and (type = 1 or type = 3)";
        const [orderRow] = await pool.query(orderSql, [
          letterId,
          currentUserId
        ]);
        const prevOrderSql =
          "select user_id, email from letter_receiver where letter_id = ? and `order` < ? and (type = 1 or type = 3)";
        const [prevOrderRow] = await pool.query(prevOrderSql, [
          letterId,
          orderRow[0].order
        ]);
        if (prevOrderRow && prevOrderRow.length > 0) {
          prevOrderRow.map(item => {
            Send.signSendEmail(
              item.email,
              lang,
              false,
              userName,
              companyName,
              letter.title,
              lengthRow[0].number,
              letter.message,
              comment
            );
          });
        }
      }
      // 拒绝签署  发送简讯给发起人
      if (letter.enable_sms_notify) {
        const NowTime = Moment()
          .utcOffset(480)
          .format("YYYY/MM/DD");
        const smsStr = `致 ${creatorName} 先生/小姐，您於 ${NowTime} 建立的 ${letter.title}，協議已被拒絕，請登入 https://app.beingsign.com 確認訊息。`;
        sendSMS.sendSMS(mobile, smsStr);
        console.log("mobile: ", mobile);
      }
      await conn.commit();
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("ERROR", e);
      await conn.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await conn.release();
    }
  },
  getLetterList: async (request, h) => {
    const pool = request.mysql.pool;
    const type = request.query.type;
    const currentUserId = request.auth.credentials.userId;
    let start = request.query.start;
    let limit = request.query.limit;
    let keyWord = request.query.keyWord;
    let beginDate = request.query.beginDate;
    let endDate = request.query.endDate;
    let status = request.query.status;
    let tagIds = request.query["tagIds[]"] || [];
    if (status !== 0 && !status) {
      status = "";
    }
    if (!start) {
      start = 0;
    }
    if (!limit) {
      limit = 20;
    }
    let lettersArray = [];
    // 待我簽署
    if (type === 1) {
      [lettersArray] = await QueryLetter.queryNeedSignLetters({
        conn: pool,
        currentUserId,
        start,
        limit,
        keyWord,
        beginDate,
        endDate,
        status,
        tagIds
      });
    }
    // 我發起的
    if (type === 2) {
      [lettersArray] = await QueryLetter.querySendByMeLetters({
        conn: pool,
        currentUserId,
        start,
        limit,
        keyWord,
        beginDate,
        endDate,
        status,
        tagIds
      });
    }
    // 接收副本
    if (type === 4) {
      [lettersArray] = await QueryLetter.queryReceiveLetters({
        conn: pool,
        currentUserId,
        start,
        limit,
        keyWord,
        beginDate,
        endDate,
        status,
        tagIds
      });
    }
    // 歷史清單
    if (type === 5) {
      [lettersArray] = await QueryLetter.queryAllLetters({
        conn: pool,
        currentUserId,
        start,
        limit,
        keyWord,
        beginDate,
        endDate,
        status,
        tagIds
      });
    }
    if (lettersArray && lettersArray.length > 0) {
      const letterIds = lettersArray.map(item => item.id);
      const userIds = lettersArray.map(i => i.sender_id);
      const companyIds = lettersArray.map(i => i.company_id);
      const queryUserList = "select * from user where id IN (?)";
      const queryCompanyList = "select * from company where id IN (?)";
      const [userRow] = await pool.query(queryUserList, [userIds]);
      const [companyRow] = await pool.query(queryCompanyList, [companyIds]);

      // 查询is_signing
      const querySigning =
        "select * from letter_receiver where user_id = ? and letter_id IN (?)";
      const [signRow] = await pool.query(querySigning, [
        currentUserId,
        letterIds
      ]);

      // 查询letter对应的tag
      const LetterTagRowSql =
        "select t.*, lt.letter_id from tag t left join letter_tag lt on t.id = lt.tag_id where t.status = 1 and t.user_id = ? and letter_id IN (?)";
      const [LetterTagRow] = await pool.query(LetterTagRowSql, [
        currentUserId,
        letterIds
      ]);

      const data = lettersArray.map(i => {
        const d = {
          id: i.id,
          title: i.title,
          status: i.status,
          createTime: i.create_time,
          expiredTime: i.expired_time,
          read: i.read
        };
        const user = userRow.filter(j => j.id === i.sender_id)[0];
        if (user) {
          d.senderName = user.name;
        } else {
          d.senderName = "";
        }
        const company = companyRow.filter(j => j.id === i.company_id)[0];
        if (company) {
          d.companyName = company.name;
        } else {
          d.companyName = "";
        }
        d.isSigning =
          signRow.filter(j => j.letter_id === i.id).map(n => n.is_signing)[0] ||
          0;
        // 标签数组
        d.tagNames = LetterTagRow.filter(j => j.letter_id === i.id).map(
          n => n.name
        );
        return d;
      });
      return {
        code: 200,
        message: "success",
        data
      };
    } else {
      return {
        code: 200,
        message: "success",
        data: []
      };
    }
  },
  getLetterDetail: async (request, h) => {
    const pool = request.mysql.pool;
    const lang = request.getLocale(); // 获取语系
    const letterId = request.query.letterId;
    const currentUserId = request.auth.credentials.userId;
    const LetterSignerSignatureModel = request.getModel(
      "letterSignerSignature"
    );
    const queryLetterSql = "select * from letter where id = ?";
    try {
      const [letterRow] = await pool.query(queryLetterSql, [letterId]);

      if (letterRow && letterRow[0]) {
        const letter = letterRow[0];
        const queryLetterReceiverSql =
          "select * from letter_receiver where letter_id = ?";
        const querySenderSql = "select * from user where id = ?";
        const queryLetterFileSql =
          "select * from letter_file where letter_id = ?";
        const [letterReceiverRow] = await pool.query(queryLetterReceiverSql, [
          letterId
        ]);
        const [letterFileRow] = await pool.query(queryLetterFileSql, [
          letterId
        ]);
        const [senderRow] = await pool.query(querySenderSql, [
          letter.sender_id
        ]);
        const [currentRow] = await pool.query(querySenderSql, [currentUserId]);
        // 如果不是当前用户发起的，或者不是需要签署的，就直接返回不存在
        console.log(
          "letter.sender_id",
          letter.sender_id,
          "currentUserId",
          currentUserId
        );
        if (letter.sender_id !== currentUserId) {
          const queryUserIdSql =
            "select * from letter_receiver where letter_id = ? and user_id = ?";
          const [currIdRow] = await pool.query(queryUserIdSql, [
            letterId,
            currentUserId
          ]);
          if (currIdRow && currIdRow.length === 0) {
            return {
              code: 94001,
              message: ErrorCodes[lang]["94001"]
            };
          }
        }
        const readList = letterReceiverRow.filter(
          i => i.read !== 1 && i.user_id === currentUserId
        );
        if (readList.length > 0) {
          // 发送已读邮件
          sendMail.sendOneMail("alreadyRead", lang, senderRow[0].email, {
            title: letter.title,
            userName: currentRow[0].name
          });
          // 设置为已读
          const changeReadSql =
            "update letter_receiver set `read` = 1 where letter_id = ? and user_id = ?";
          pool
            .query(changeReadSql, [letterId, currentUserId])
            .catch(e => console.log(e));
        }

        // 查询所关联的标签
        const queryTagListSql = "select * from letter_tag where letter_id = ?";
        const [tagListRow] = await pool.query(queryTagListSql, [letterId]);
        const sender = senderRow[0];
        const data = {
          id: letter.id,
          title: letter.title,
          status: letter.status,
          message: letter.message,
          companyId: letter.company_id,
          createTime: letter.create_time,
          expiredTime: letter.expired_time,
          withdrawTime: letter.withdraw_time,
          senderId: sender ? sender.id : 0,
          senderName: sender ? sender.name : "",
          senderEmail: sender ? sender.email : "",
          comment: letter.comment || "",
          tagList: [],
          signerList: [],
          fileList: []
        };
        const signerSignatures = await LetterSignerSignatureModel.findAll({
          letterId: letterId
        });
        const letterReceiverRowData = letterReceiverRow.filter(
          item => item.type === 1 || item.type === 3
        );
        if (letterReceiverRowData && letterReceiverRowData.length > 0) {
          const queryUserSql = "select * from user where id IN (?)";
          const queryCompanySql = "select * from company where id IN (?)";
          const userIds = letterReceiverRowData.map(i => i.user_id);
          const companyIds = letterReceiverRowData.map(
            i => i.receiver_company_id
          );
          const [userRow] = await pool.query(queryUserSql, [userIds]);
          const [companyRow] = await pool.query(queryCompanySql, [companyIds]);
          const receivers = letterReceiverRowData.map(i => {
            const d = {
              createTime: i.create_time,
              status: i.is_signing,
              order: i.order,
              senderName: "",
              email: i.email,
              comment: i.comment || "",
              signTime: i.sign_time || "",
              type: i.type === 1 ? "SIGN" : "APPROVAL",
              corpId: i.receiver_company_id
            };
            if (userRow && userRow.length > 0) {
              const user = userRow.filter(j => j.id === i.user_id);

              if (user && user[0]) {
                const u = user[0];
                d.senderName = u.name;
                d.email = u.email;
              } else {
                d.senderName = "";
              }
            }
            if (!d.senderName) {
              if (d.email) {
                d.senderName = d.email.slice(0, d.email.indexOf("@"));
              }
            }
            if (companyRow && companyRow.length > 0) {
              const company = companyRow.filter(
                j => j.id === i.receiver_company_id
              );
              if (company && company[0]) {
                const c = company[0];
                d.companyName = c.name;
              } else {
                d.companyName = "";
              }
            }
            return d;
          });
          data.signerList = receivers;
        }
        if (letterFileRow && letterFileRow.length > 0) {
          const files = letterFileRow.map(i => {
            return {
              fileId: i.id,
              fileName: i.name,
              fileType: i.type,
              url: i.url,
              signatures: signerSignatures
                .filter(s => i.url === s.letterFileKey)
                .map(s => {
                  return {
                    page: s.pageNo,
                    pageOffsetX: s.positionX,
                    pageOffsetY: s.positionY,
                    color: s.color,
                    content: s.pngContent
                  };
                })
            };
          });
          data.fileList = files;
        }
        // 查询标签
        if (tagListRow) {
          const tagIds = tagListRow.map(item => [item][0].tag_id);
          if (tagIds.length > 0) {
            const queryTagsSql =
              "select * from tag where status = 1 and user_id = ? and id IN (?)";
            const [tagRow] = await pool.query(queryTagsSql, [
              currentUserId,
              tagIds
            ]);
            if (tagRow && tagRow.length > 0) {
              const tagList = tagRow.map(item => {
                return {
                  tagId: item.id,
                  tagName: item.name
                };
              });
              data.tagList = tagList;
            }
          }
        }
        return {
          code: 200,
          message: "success",
          data
        };
      } else {
        console.log("letterDetail not found");
        return {
          code: 94001,
          message: ErrorCodes[lang]["94001"]
        };
      }
    } catch (e) {
      console.log(e, "getLetterDetail");
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  letterStatus: async (request, h) => {
    const pool = request.mysql.pool;
    const currentUserId = request.auth.credentials.userId;
    const NowTime = Moment()
      .utcOffset(480)
      .format("YYYY-MM-DD HH:mm:ss");
    // console.log('NowTime:::::::', NowTime);
    const queryCreatedByMeSql =
      "SELECT count(1) c FROM letter WHERE sender_id = ? OR id IN (SELECT letter_id FROM letter_receiver WHERE user_id = ?)";
    const querySend2MeSql =
      "select count(1) c FROM letter_receiver WHERE user_id = ? and type = 2 and `read` = 0";
    const queryPendingSql =
      "SELECT count(1) c FROM letter l LEFT JOIN letter_receiver lr ON l.id = lr.letter_id WHERE lr.user_id = ? and (lr.type = 1 or lr.type = 3) AND l.status = 2  AND lr.is_signing = 2 AND lr.`order` = l.`progress` AND lr.`read` = 0 AND (l.`expired_time` is NULL OR l.`expired_time` > ?)";
    const [myOwn] = await pool.query(queryCreatedByMeSql, [
      currentUserId,
      currentUserId
    ]);
    const [sendToMe] = await pool.query(querySend2MeSql, [currentUserId]);
    const [pending] = await pool.query(queryPendingSql, [
      currentUserId,
      NowTime
    ]);
    return {
      code: 200,
      message: "success",
      data: {
        pending: pending[0].c,
        myOwn: myOwn[0].c,
        sendToMe: sendToMe[0].c
      }
    };
  },
  fileVerify: async (request, h) => {
    const file = request.payload.file;
    const lang = request.getLocale(); // 获取语系
    if (file) {
      const path = file.path;
      console.log(path);
      try {
        const data = await Signing.verifyFile(path, request.mysql.pool);
        if (data && data.code === 200) {
          return {
            code: 200,
            message: "SUCCESS",
            data: {
              isChanged: true,
              signStatus: data.signingStatus
            }
          };
        } else {
          return {
            code: data.code,
            message: ErrorCodes[lang][data.code]
          };
        }
      } catch (e) {
        request.log("ERROR", e);
      }
      return {
        code: 91903,
        message: ErrorCodes[lang]["91903"]
      };
    } else {
      return {
        code: 91903,
        message: ErrorCodes[lang]["91903"]
      };
    }
  },
  fileUpload: async (request, h) => {
    const file = request.payload.file;
    const version = request.payload.version;
    const lang = request.getLocale(); // 获取语系

    if (file) {
      const name = file.filename.replace(/,|，/g, "");
      const path = file.path;
      const fileSize = file.bytes;
      const type = file.headers["content-type"];
      const uuid = Uuidv4();
      // console.log(file)
      // 文件格式 限制pdf
      let strType = name.substring(name.length - 3, name.length);
      strType = strType.toLowerCase();
      if (strType !== "pdf" || type !== "application/pdf") {
        return {
          code: 94013,
          message: ErrorCodes[lang]["94013"]
        };
      }
      //   /2018/12/03/uuid.xxx
      const date = new Date();
      let fileHash;
      let url = `${date.getFullYear()}/${date.getMonth() +
        1}/${date.getDate()}/${uuid}.${strType}`; // oss存储的名字路径
      if (version) {
        url += `.${version}`;
      }
      const fileBuffer = Fs.readFileSync(path);
      // 先 copy 文件到 prew 下
      const baseUrl = Path.join(__dirname, "../../preview");
      if (!Fs.existsSync(baseUrl)) {
        Fs.mkdirSync(baseUrl);
      }
      // 加密
      const encryptFileUrl = baseUrl + "/" + url.replace(/\//g, "-"); // 加密后的文件路径 preview文件夹下作为缓存
      if (version) {
        await cryptUtil.encryptFile(path, encryptFileUrl, version);
      }
      try {
        fileHash = Crypto.createHash("sha256")
          .update(fileBuffer)
          .digest()
          .toString("hex");
        await OSS.put(url, encryptFileUrl);
      } catch (err) {
        request.log("ERROR", err);
        return {
          code: 99002,
          message: ErrorCodes[lang]["99002"]
        };
      } finally {
        // Fs.writeFileSync(baseUrl + "/" + url.replace(/\//g, "-"), fileBuffer);
        // 上传阿里云之后 删除缓存里面的文件
        Fs.unlink(path, err => {
          if (err) throw err;
          request.log("UPLOAD", "缓存文件已删除, path: " + path);
        });
      }

      return {
        code: 200,
        message: "success",
        data: {
          fileSize: fileSize,
          fileName: name,
          fileType: type,
          fileUrl: url,
          fileHash: fileHash
        }
      };
    } else {
      return {
        code: 94009,
        message: ErrorCodes[lang]["94009"]
      };
    }
  },
  letterDownload: async (request, h) => {
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const userAgent = (request.headers["user-agent"] || "").toLowerCase();
    const key = request.query.key;
    const pool = request.mysql.pool;
    const lang = request.getLocale(); // 获取语系
    const UserModel = request.getModel("user");
    const LetterReceiverModel = request.getModel("letterReceiver");
    const LetterSignerSignatureModel = request.getModel(
      "letterSignerSignature"
    );
    const LetterFileModel = request.getModel("letterFile");
    const LetterModel = request.getModel("letter");
    const Sequelize = request.getDb().sequelize;
    const currentUserId = request.auth.credentials.userId;
    const userRow = await UserModel.findOne({
      where: { id: currentUserId, status: 1 }
    });
    if (!userRow) {
      return {
        code: 99001,
        message: ErrorCodes[lang]["99001"]
      };
    }
    const file = await LetterFileModel.findOne({ where: { url: key } });
    if (!file) {
      return {
        code: 94001,
        message: ErrorCodes[lang]["94001"]
      };
    }
    const letterId = file.letterId;
    const letter = await LetterModel.findOne({ where: { id: letterId } });
    if (!letter) {
      return {
        code: 94001,
        message: ErrorCodes[lang]["94001"]
      };
    }
    const signerSignatures = await LetterSignerSignatureModel.findAll({
      where: { letterId: letterId, letterFileKey: key }
    });
    const senderID = letter.senderId;
    if (senderID !== currentUserId) {
      const fileReceiver = await LetterReceiverModel.findOne({
        where: { letterId, userId: currentUserId }
      });
      if (!fileReceiver) {
        return {
          code: 94010,
          message: ErrorCodes[lang]["94010"]
        };
      }
      if (!fileReceiver.viewFile) {
        fileReceiver.viewFile = 1;
        await fileReceiver.save();
        const sender = await UserModel.findOne({
          where: { id: senderID, status: 1 }
        });
        sendMail.sendOneMail("viewFile", lang, sender.email, {
          title: letter.title,
          userName: userRow.name
        });
      }
    }
    const querySignerList =
      "select u.id, u.name,u.email,c.name company_name, f.is_signing, f.create_time, f.sign_time from letter_receiver f left join user u on f.user_id = u.id left join company c on f.receiver_company_id = c.id where f.letter_id = :letterId and f.type = 1 and f.is_signing = 3";
    const signerList = await Sequelize.query(querySignerList, {
      replacements: { letterId },
      type: Sequelize.QueryTypes.SELECT
    });
    const baseUrl = Path.join(__dirname, "../../preview");
    if (!Fs.existsSync(baseUrl)) {
      Fs.mkdirSync(baseUrl);
    }
    const fileUrl = baseUrl + "/" + file.url.replace(/\//g, "-");
    try {
      Fs.accessSync(fileUrl, Fs.constants.F_OK);
    } catch (err) {
      request.log("download", "loading from oss");
      await OSS.get(file.url, fileUrl);
    }
    const newFileUrl = fileUrl.replace(".pdf", "download.pdf");
    let decryptFileUrl = fileUrl;
    // 获取db里文件的url，判断是否需要解密
    const dotIndex = file.url.lastIndexOf(".");
    const version = file.url.substring(dotIndex + 1, file.url.length);
    if (version !== "pdf") {
      decryptFileUrl = fileUrl.replace(".pdf", "decrypt.pdf");
      await cryptUtil.decryptFile(fileUrl, decryptFileUrl, version);
    }
    const defaultSignatures = signerList
      .filter(i => signerSignatures.find(j => j.userId === i.id) === undefined)
      .map(item => {
        let str = "";
        str += item.company_name ? item.company_name + "\n" : "";
        str += item.name; // + ' agree'// ErrorCodes[lang]['sign_agree'];
        str +=
          "\n" +
          Moment(item.sign_time || item.create_time)
            .utcOffset(480)
            .format("YYYY/MM/DD"); // 默认东八区时间
        return str;
      });
    try {
      await PdfUtil.addEStamp(
        decryptFileUrl,
        newFileUrl,
        defaultSignatures,
        signerSignatures
      );
      PdfUtil.addDocumentId(
        newFileUrl,
        newFileUrl,
        `BeingSign Document Id: ${letter.uuid}`
      );
      await Signing.createFile(
        newFileUrl,
        pool,
        currentUserId,
        ip,
        userAgent,
        letter.status
      );
    } catch (e) {
      request.log("ERROR", e);
    }
    const fileByte = Fs.readFileSync(newFileUrl);
    const response = h.response(fileByte);
    response.type("application/pdf");
    const fileNameNew = encodeURIComponent(decodeURIComponent(file.name));
    if (userAgent.indexOf("firefox") >= 0) {
      response.header(
        "content-disposition",
        "attachment; filename*=utf-8'zh_cn'" + fileNameNew
      );
    } else {
      response.header(
        "content-disposition",
        "attachment; filename=" + fileNameNew
      );
    }
    return response;
  },
  letterPreview: async (request, h) => {
    const key = request.query.key;
    const lang = request.getLocale(); // 获取语系
    const access = request.query.access || "";
    const UserModel = request.getModel("user");
    const LetterReceiverModel = request.getModel("letterReceiver");
    const LetterFileModel = request.getModel("letterFile");
    const LetterModel = request.getModel("letter");
    const Sequelize = request.getDb().sequelize;
    const LetterSignerSignatureModel = request.getModel(
      "letterSignerSignature"
    );
    const currentUserId = request.auth.credentials.userId;
    const userRow = await UserModel.findOne({
      where: { id: currentUserId, status: 1 }
    });
    if (!userRow) {
      return {
        code: 99001,
        message: ErrorCodes[lang]["99001"]
      };
    }
    let signerSignatures = [];
    let signerList = [];
    if (!access) {
      const file = await LetterFileModel.findOne({ where: { url: key } });
      if (!file) {
        return {
          code: 94001,
          message: ErrorCodes[lang]["94001"]
        };
      }
      const letterId = file.letterId;
      const letter = await LetterModel.findOne({ where: { id: letterId } });
      if (!letter) {
        return {
          code: 94001,
          message: ErrorCodes[lang]["94001"]
        };
      }
      const senderID = letter.senderId;
      signerSignatures = await LetterSignerSignatureModel.findAll({
        where: { letterId: letterId, letterFileKey: key }
      });
      const querySignerList =
        "select u.id, u.name,u.email,c.name company_name, f.is_signing, f.create_time, f.sign_time from letter_receiver f left join user u on f.user_id = u.id left join company c on f.receiver_company_id = c.id where f.letter_id = :letterId and f.type = 1 and f.is_signing = 3";
      signerList = await Sequelize.query(querySignerList, {
        replacements: { letterId },
        type: Sequelize.QueryTypes.SELECT
      });
      if (senderID !== currentUserId) {
        const fileReceiver = await LetterReceiverModel.findOne({
          where: { letterId, userId: currentUserId }
        });
        if (!fileReceiver) {
          return {
            code: 94010,
            message: ErrorCodes[lang]["94010"]
          };
        }
        if (!fileReceiver.viewFile) {
          fileReceiver.viewFile = 1;
          await fileReceiver.save();
          const sender = await UserModel.findOne({
            where: { id: senderID, status: 1 }
          });
          sendMail.sendOneMail("viewFile", lang, sender.email, {
            title: letter.title,
            userName: userRow.name
          });
        }
      }
    }
    const baseUrl = Path.join(__dirname, "../../preview");
    if (!Fs.existsSync(baseUrl)) {
      Fs.mkdirSync(baseUrl);
    }
    const fileUrl = baseUrl + "/" + key.replace(/\//g, "-");
    // 检查目录中是否存在该文件 存在就直接 preview ，否则就下载下来再 preview
    const newFileUrl = fileUrl.replace(".pdf", "out.pdf");
    let decryptFileUrl = fileUrl;
    const text = userRow.email;
    try {
      Fs.accessSync(fileUrl, Fs.constants.F_OK);
    } catch (err) {
      request.log("download", "loading from oss");
      await OSS.get(key, fileUrl);
    }
    // 获取db里文件的url，判断是否需要解密
    const dotIndex = key.lastIndexOf(".");
    const version = key.substring(dotIndex + 1, key.length);
    if (version !== "pdf") {
      decryptFileUrl = fileUrl.replace(".pdf", "decrypt.pdf");
      await cryptUtil.decryptFile(fileUrl, decryptFileUrl, version);
    }
    const defaultSignatures = signerList
      .filter(i => signerSignatures.find(j => j.userId === i.id) === undefined)
      .map(item => {
        let str = "";
        str += item.company_name ? item.company_name + "\n" : "";
        str += item.name; // + ' agree'// ErrorCodes[lang]['sign_agree'];
        str +=
          "\n" +
          Moment(item.sign_time || item.create_time)
            .utcOffset(480)
            .format("YYYY/MM/DD"); // 默认东八区时间
        return str;
      });
    try {
      console.log(
        "EStamp:",
        defaultSignatures,
        JSON.stringify(signerSignatures)
      );
      await PdfUtil.addEStamp(
        decryptFileUrl,
        newFileUrl,
        defaultSignatures,
        signerSignatures
      );
      PdfUtil.addWatermark(newFileUrl, newFileUrl, text);
    } catch (e) {
      console.error(e);
    }
    return h.file(newFileUrl);
  },
  smsNotify: async (request, h) => {
    const lang = request.getLocale(); // 获取语系
    const SmsNotifyModel = request.getModel("smsNotify");
    try {
      const smsId = request.query.msgid;
      // const receiver = request.query.dstaddr;
      // const smsStatus = request.query.statusstr;
      const smsStatusCode = request.query.statuscode === "4" ? 2 : 0;
      // const doneTime = request.query.donetime;

      if (smsId) {
        await SmsNotifyModel.update(
          {
            status: smsStatusCode
          },
          {
            smsId
          }
        );
        console.log("sms received");
      } else {
        console.log("sms gone");
      }
    } catch (e) {
      request.log("ERROR", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  smsCheck: async (request, h) => {
    const lang = request.getLocale();
    const smsId = request.query.smsId;
    const SmsNotifyModel = request.getModel("smsNotify");

    try {
      const smsObj = await SmsNotifyModel.findOne({ where: { smsId } });
      return smsObj;
    } catch (e) {
      request.log("ERROR", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  }
};
