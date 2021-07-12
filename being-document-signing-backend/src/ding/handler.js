const Boom = require("@hapi/boom");
const Uuidv4 = require("uuid/v4");
const Crypto = require("crypto");
const RandomString = require("randomstring");
const ErrorCodes = require("../libs/errorCodes");

module.exports = {
  notImplemented: async request => {
    throw Boom.notImplemented("not implemented");
  },
  activeSuite: async (request, h) => {
    const Dingtalk = require("../libs/dingtalk")({
      redis: request.redis.client,
      mysql: request.mysql.pool
    });
    const pool = request.mysql.pool;
    const allCorpInfo = await Dingtalk.getAllCorpInfo();
    if (allCorpInfo && allCorpInfo.length > 0) {
      let allCorpId = allCorpInfo.map(i => i.corpid);
      const queryCorpExistSql =
        "select * from company_oauth where source_name = 'dingtalk' and source_company_id IN (?)";
      const [queryCorpExist] = await pool.query(queryCorpExistSql, [allCorpId]);
      if (queryCorpExist && queryCorpExist.length > 0) {
        const exists = queryCorpExist.map(i => i.source_company_id);
        allCorpId = allCorpId.filter(i => exists.indexOf(i) <= -1);
      }
      allCorpId.map(async i => {
        request.log("do_active", i);
        const resp = await Dingtalk.activeSuite(i);
        request.log("do_active", resp.data);

        let corp = allCorpInfo.filter(j => j.corpid == i);
        if (corp && corp.length > 0) {
          corp = corp[0];
          const corpName = corp.corp_name;
          const insertCompanySql =
            "INSERT INTO `company` (`uuid`, `name`, `url`, `status`, `create_time`, `applicant_id`, `signing_quota`, `signing_remain`) VALUES	(?, ?, ?, ?, ?, 0, 0, 0)";
          const [insertCompanyRow] = await pool.query(insertCompanySql, [
            Uuidv4(),
            corpName,
            "",
            1,
            new Date()
          ]);
          const companyId = insertCompanyRow.insertId;
          const insertCompanyAuthSql =
            "INSERT INTO `company_oauth` (`uuid`, `company_id`, `source_name`, `source_company_id`, `status`, `create_time`) VALUES	(?, ?, ?, ?, ?, ?)";
          await pool.query(insertCompanyAuthSql, [
            Uuidv4(),
            companyId,
            "dingtalk",
            i,
            1,
            new Date()
          ]);
        }
      });
    }
    return {
      code: 200,
      message: "success"
    };
  },
  getDingConfig: async (request, h) => {
    const Dingtalk = require("../libs/dingtalk")({
      redis: request.redis.client,
      mysql: request.mysql.pool
    });
    const lang = request.getLocale(); // 获取语系
    let timeStamp = new Date().getTime();
    let nonceStr = RandomString.generate(8);
    try {
      let corpId = request.query.corpId;
      let ticket = await Dingtalk.getJsTicket(corpId);
      let plain = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timeStamp}&url=${decodeURIComponent(
        request.query.url
      )}`;
      let signature = Crypto.createHash("sha1")
        .update(plain, "utf8")
        .digest("hex");
      let agentId = await Dingtalk.getCorpAgentId(corpId);
      if (agentId && ticket) {
        return {
          code: 200,
          message: "success",
          data: {
            agentId,
            signature,
            corpId,
            nonceStr,
            timeStamp
          }
        };
      }
      return {
        code: 99003,
        message: ErrorCodes[lang]["99003"]
      };
    } catch (error) {
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"],
        data: error
      };
    }
  },
  login: async (request, h) => {
    const xFF = request.headers["x-forwarded-for"];
    const xR = request.headers["x-real-ip"];
    const lang = request.getLocale(); // 获取语系
    const ip = xFF ? xFF.split(",")[0] : xR || request.info.remoteAddress;
    const corpId = request.payload.corpId;
    const code = request.payload.code;
    const pool = await request.mysql.pool.getConnection();
    try {
      await pool.beginTransaction();
      const Dingtalk = require("../libs/dingtalk")({
        redis: request.redis.client,
        mysql: pool
      });
      let beingUserId = 0;
      let userId = "";
      const userInfo = await Dingtalk.getUserInfo(corpId, code);
      request.log("ding_user_info", userInfo);
      if (!userInfo) {
        throw Boom.internal("call getUserInfo error");
      }
      userId = userInfo.userid;
      const level = userInfo.sys_level;
      // check corp exists
      const corpExistSql =
        "select * from company_oauth where source_name = 'dingtalk' and source_company_id = ?";
      const [corpExistRow] = await pool.query(corpExistSql, [corpId]);
      let companyId = null;
      if (!corpExistRow || !corpExistRow[0]) {
        const corpInfo = await Dingtalk.getCorpInfo(corpId);
        if (corpInfo) {
          const corpName = corpInfo.corp_name;
          const insertCompanySql =
            "INSERT INTO `company` (`uuid`, `name`, `url`, `status`, `create_time`, `applicant_id`, `signing_quota`, `signing_remain`) VALUES	(?, ?, ?, ?, ?, 0, 0, 0)";
          const [insertCompanyRow] = await pool.query(insertCompanySql, [
            Uuidv4(),
            corpName,
            "",
            1,
            new Date()
          ]);
          companyId = insertCompanyRow.insertId;
          const insertCompanyAuthSql =
            "INSERT INTO `company_oauth` (`uuid`, `company_id`, `source_name`, `source_company_id`, `status`, `create_time`) VALUES	(?, ?, ?, ?, ?, ?)";
          await pool.query(insertCompanyAuthSql, [
            Uuidv4(),
            companyId,
            "dingtalk",
            corpId,
            1,
            new Date()
          ]);
        }
      } else {
        companyId = corpExistRow[0].id;
      }
      // check user exists
      const checkUserExistSql =
        "select * from user_oauth where name='dingtalk' and third_id = ? and company_id = ?";
      const [userExistRow] = await pool.query(checkUserExistSql, [
        userId,
        companyId
      ]);
      if (!userExistRow || !userExistRow[0]) {
        const userDetail = await Dingtalk.getUserDetail(corpId, userId);
        request.log("ding_user_detail", userDetail.data);
        // user not exists
        let userName = "dingtalk_" + userId;
        let userMobile = "";
        if (userDetail && userDetail.data && userDetail.data.name) {
          userName = userDetail.data.name;
        }
        if (userDetail && userDetail.data && userDetail.data.mobile) {
          userMobile = userDetail.data.mobile;
        }
        const insertUserSql =
          "insert into user (uuid,name,status,register_ip,register_time,mobile_verify, language_code) values (?,?,?,?,?,?,?)";
        const [insertUserRow] = await pool.query(insertUserSql, [
          Uuidv4(),
          userName,
          1,
          ip,
          new Date(),
          userMobile,
          lang
        ]);
        beingUserId = insertUserRow.insertId;
        const insertUserAuthSql =
          "INSERT INTO `user_oauth` (`uuid`, `company_id`,`user_id`, `name`, `third_id`, `status`, `create_time`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await pool.query(insertUserAuthSql, [
          Uuidv4(),
          companyId,
          beingUserId,
          "dingtalk",
          userId,
          1,
          new Date()
        ]);
      } else {
        beingUserId = userExistRow[0].user_id;
        // update last login time
        const updateLastLoginTime =
          "update user set last_login_time = ? where id = ?";
        await pool.query(updateLastLoginTime, [new Date(), beingUserId]);
        const updateAuthLastLoginTime =
          "update user_oauth set last_login = ? where third_id = ? and company_id = ?";
        await pool.query(updateAuthLastLoginTime, [
          new Date(),
          userId,
          companyId
        ]);
      }
      if (level && level == 1) {
        const checkAdminExists =
          "select count(1) as c from company_authorized where status = 1 and role = 1 and company_id = ?";
        const [adminExistRow] = await pool.query(checkAdminExists, [companyId]);
        if (adminExistRow[0] && adminExistRow[0].c) {
          request.log("admin", "admin exists");
        } else {
          const insertCompanyAdminSql =
            "INSERT INTO `company_authorized` (`uuid`, `company_id`, `user_id`, `role`, `status`, `authorizer_signature_id`, `cancel_signature_id`, `create_time`, `stop_time`) VALUES( ? , ? , ? , ? , ? , ? , ? , ? , NULL)";
          await pool.query(insertCompanyAdminSql, [
            Uuidv4(),
            companyId,
            beingUserId,
            1,
            1,
            0,
            0,
            new Date()
          ]);
        }
      }
      const user = {
        userId: beingUserId,
        address: null,
        email: null,
        type: "dingtalk"
      };
      // get email address
      const emailSql =
        "select id,email,language_code from user where id = ? and status = 1";
      const [emailRow] = await pool.query(emailSql, [beingUserId]);
      const userEmail = emailRow[0];
      if (userEmail) {
        user.email = userEmail.email;
      }
      // get block chain address
      const addressSql =
        "select user_id,address from address_list where status = 1 and user_id = ? order by create_time desc limit 1";
      const [addressRow] = await pool.query(addressSql, [beingUserId]);
      const userAddress = addressRow[0];
      if (userAddress) {
        user.address = userAddress.address;
      }
      // build redis data
      const token = Uuidv4();
      const redis = request.redis.client;
      await redis.set("access_token:" + token, JSON.stringify(user));
      await pool.commit();
      return {
        code: 200,
        message: "success",
        token,
        lang: userEmail.language_code || ""
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
  }
};
