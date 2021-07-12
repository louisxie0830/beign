const Boom = require("@hapi/boom");
const Uuidv4 = require("uuid/v4");
const ErrorCodes = require("../libs/errorCodes");

const POST_CONTACT_ADD =
  "INSERT INTO contact (uuid, owner_id, contact_email, contact_name) VALUES (? ,? ,? ,?)";
const POST_CONTACT_DELETE =
  "DELETE FROM contact WHERE id = ? and owner_id = ?  ;";

module.exports = {
  notImplemented: async request => {
    throw Boom.notImplemented("not implemented");
  },
  getContactList: async request => {
    const pool = request.mysql.pool;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    request.log("currentUserId", currentUserId);
    let start = request.query.start;
    let limit = request.query.limit;
    let keyword = request.query.keyword;
    if (!start) {
      start = 0;
    }
    if (!limit) {
      limit = 20;
    }

    try {
      let keywordCondition = "(contact_email like ? or contact_name like ? )";
      let params = [
        "%" + keyword + "%",
        "%" + keyword + "%",
        currentUserId,
        start,
        limit
      ];
      if (!keyword) {
        keywordCondition = "1=1";
        params = [currentUserId, start, limit];
      }
      const GET_CONTACTLIST_BY_KEYWORD = `SELECT * FROM contact where ${keywordCondition} and owner_id = ? order by create_time limit ?, ?`;
      let [contact] = await pool.query(GET_CONTACTLIST_BY_KEYWORD, params);

      const list = contact.map(i => {
        return {
          id: i.id,
          name: i.contact_name,
          email: i.contact_email
        };
      });
      return {
        code: 200,
        message: "success",
        data: list
      };
    } catch (e) {
      request.log("ERROR", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  postContactDelete: async request => {
    const conn = await request.mysql.pool.getConnection();
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    let id = request.payload.contractId;
    try {
      await conn.beginTransaction();
      await conn.query(POST_CONTACT_DELETE, [id, currentUserId]);
      await conn.commit();
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      console.error(e);
      await conn.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await conn.release();
    }
  },
  postContactAdd: async request => {
    const conn = await request.mysql.pool.getConnection();
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    let contactName = request.payload.name;
    let contactEmail = request.payload.email;
    const queryContactExistSql =
      "select count(1) c from contact where owner_id = ? and contact_email = ?";
    try {
      await conn.beginTransaction();
      const [contactExists] = await conn.query(queryContactExistSql, [
        currentUserId,
        contactEmail
      ]);
      if (contactExists && contactExists[0].c > 0) {
        return {
          code: 92001,
          message: ErrorCodes[lang]["92001"]
        };
      }
      const [contactObj] = await conn.query(POST_CONTACT_ADD, [
        Uuidv4(),
        currentUserId,
        contactEmail,
        contactName
      ]);
      const addId = contactObj.insertId;
      await conn.commit();
      return {
        code: 200,
        message: "success",
        data: {
          id: addId,
          name: contactName,
          email: contactEmail
        }
      };
    } catch (e) {
      console.error(e);
      await conn.rollback();
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await conn.release();
    }
  },
  getCompanyList: async request => {
    const pool = request.mysql.pool;
    const email = request.query.email;
    const queryCompanySql = "SELECT c.id,c.name FROM `user` u JOIN `company_authorized` ca ON u.id = ca.`user_id` AND ca.`role` = 3 JOIN `company` c ON ca.`company_id` = c.id WHERE u.`email` = ? and ca.status = 1";
    const [companyRow] = await pool.query(queryCompanySql, [email]);
    if(!companyRow || !companyRow[0]){
      return {
        code: 200,
        message: 'success',
        data: []
      }
    }
    const data = companyRow.map((item) => {
      return {
        id: item.id,
        name: item.name
      }
    })
    return {
      code: 200,
      message: 'success',
      data
    }
  }
};
