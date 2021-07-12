const Boom = require("@hapi/boom");
const ErrorCodes = require("../libs/errorCodes");
module.exports = {
  notImplemented: async request => {
    throw Boom.notImplemented("not implemented");
  },
  addOrUpdateTag: async (request, h) => {
    const pool = request.mysql.pool;
    const currentUserId = request.auth.credentials.userId;
    const tagId = request.payload.tagId;
    const lang = request.getLocale(); // 获取语系
    const tagName = request.payload.tagName;
    const d = {};
    try {
      if (tagId) {
        const queryTagsSql = "select * from tag where id = ? and status = 1";
        const [tagsRow] = await pool.query(queryTagsSql, [tagId]);
        if (!tagsRow || !tagsRow[0]) {
          return {
            code: 96001,
            message: ErrorCodes[lang]["96001"]
          };
        }
        const updateTagsSql = "update tag set name = ? where id = ?";
        await pool.query(updateTagsSql, [tagName, tagId]);
        d.id = tagId;
        d.name = tagName;
      } else {
        const queryTagsSql =
          "select * from tag where status = 1 and user_id = ?";
        const [tagsRow] = await pool.query(queryTagsSql, [currentUserId]);
        const names = tagsRow.map(i => i.name);
        if (names.length > 0) {
          if (names.indexOf(tagName) > -1) {
            return {
              code: 96004,
              message: ErrorCodes[lang]["96004"]
            };
          }
        }
        if (tagsRow && tagsRow.length >= 20) {
          return {
            code: 96002,
            message: ErrorCodes[lang]["96002"]
          };
        }
        const insertTagSql =
          "insert into tag (name, user_id, created_at) values (?, ?, ?)";
        const [insert] = await pool.query(insertTagSql, [
          tagName,
          currentUserId,
          new Date()
        ]);
        d.id = insert.insertId;
        d.name = tagName;
      }
      return {
        code: 200,
        message: "success",
        data: d
      };
    } catch (e) {
      request.log("addOrUpdateTag", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  delTag: async (request, h) => {
    const pool = request.mysql.pool;
    const tagId = request.payload.tagId;
    const currentUserId = request.auth.credentials.userId;
    const lang = request.getLocale(); // 获取语系
    try {
      const queryTagsSql =
        "select * from tag where id = ? and user_id = ? and status = 1";
      const [tagsRow] = await pool.query(queryTagsSql, [tagId, currentUserId]);
      if (!(tagsRow && tagsRow[0])) {
        return {
          code: 96001,
          message: ErrorCodes[lang]["96001"]
        };
      }
      const updateTagSql =
        "update tag set status = 2 where user_id = ? and id = ?";
      await pool.query(updateTagSql, [currentUserId, tagId]);
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("delTag", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
  getTagList: async (request, h) => {
    const pool = request.mysql.pool;
    const currentUserId = request.auth.credentials.userId;
    const lang = request.getLocale(); // 获取语系
    let start = request.query.start;
    let limit = request.query.limit;
    if (!start) {
      start = 0;
    }
    if (!limit) {
      limit = 20;
    }
    try {
      const queryTagsSql =
        "select * from tag where status = 1 and user_id = ? limit ?, ?";
      const [tagsRow] = await pool.query(queryTagsSql, [
        currentUserId,
        start,
        limit
      ]);
      let data = [];
      if (tagsRow.length > 0) {
        data = tagsRow.map(item => {
          return {
            id: item.id,
            name: item.name,
            status: item.status,
            createTime: item.created_at
          };
        });
      }
      return {
        code: 200,
        message: "success",
        data
      };
    } catch (e) {
      request.log("getTagList", e);
      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    }
  },
    detailUpdate: async (request, h) => {

    const pool = await request.mysql.pool.getConnection();
    const letterId = request.payload.letterId;
    const lang = request.getLocale(); // 获取语系
    const currentUserId = request.auth.credentials.userId;
    const tagIds = request.payload.tagIds;
    try {
      // 当前用户下所有的可用标签

      let selectInvalidTagSql =
        "select id from tag where status = 1 and user_id = ? ";
      let selectInvalidTagArg = [];
      if (tagIds.length > 0) {
        selectInvalidTagSql = selectInvalidTagSql + " and id IN (?)";
        selectInvalidTagArg.push(currentUserId);
        selectInvalidTagArg.push(tagIds);
      } else {
        selectInvalidTagArg.push(currentUserId);
      }

      const selectInvalidTagRow = await pool.query(
        selectInvalidTagSql,
        selectInvalidTagArg
      );
      let tags = [];
      if (selectInvalidTagRow.length > 0) {
        tags = selectInvalidTagRow.map(item => {
          return item.id;
        });
      }
      if (tags.length === 0) {
        throw new Error("96003");
      }
      await pool.beginTransaction();
      // 删除原来的
      const delSql = "delete from letter_tag where letter_id = ? ";
      await pool.query(delSql, [letterId]);
      const tagList = tagIds.map(item => {
        return [
          letterId, // letter_id
          item // tag_id
        ];
      });

      if (tagList.length > 0) {
        const insertLetterTagSql =
          "insert into letter_tag (letter_id, tag_id) values ?";
        await pool.query(insertLetterTagSql, [tagList]);
      }

      await pool.commit();
      return {
        code: 200,
        message: "success"
      };
    } catch (e) {
      request.log("detailUpdate", e);
      await pool.rollback();
      if (e.message === "96003") {
        return {
          code: 96003,
          message: ErrorCodes[lang]["96003"]
        };
      }

      return {
        code: 99002,
        message: ErrorCodes[lang]["99002"]
      };
    } finally {
      await pool.release();
    }
  }
};
