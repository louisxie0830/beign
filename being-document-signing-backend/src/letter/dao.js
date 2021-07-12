module.exports = {
  // 待我签署
  queryNeedSignLetters: async ({
    conn,
    currentUserId,
    start,
    limit,
    keyWord,
    beginDate,
    endDate,
    status,
    tagIds
  }) => {
    let sql =
      "SELECT l.*, lr.`read` FROM letter l LEFT JOIN letter_receiver lr ON l.id = lr.letter_id WHERE lr.user_id = ? and l.status = 2 and (lr.type = 1 or lr.type = 3) AND lr.is_signing = 2 AND lr.`order` = l.`progress`";
    let params = [currentUserId];
    if (keyWord) {
      sql +=
        " and (l.title like ? or l.message like ? or l.sender_id IN (select id from user where name like ? or email like ?))";
      params.push(
        `%${keyWord}%`,
        `%${keyWord}%`,
        `%${keyWord}%`,
        `%${keyWord}%`
      );
    }
    if (beginDate && endDate) {
      sql += ` and l.create_time between ? and ?`;
      params.push(beginDate + ' 00:00:00', endDate + ' 23:59:59');
    }
    if (tagIds && tagIds.length > 0) {
      sql +=
        " and l.id in (select letter_id from letter_tag where tag_id IN (?))";
      params.push(tagIds);
    }
    sql += " order by l.create_time desc limit ?,?";
    params.push(start, limit);
    return conn.query(sql, params);
  },
  // 我发起的
  querySendByMeLetters: async ({
    conn,
    currentUserId,
    start,
    limit,
    keyWord,
    beginDate,
    endDate,
    status,
    tagIds
  }) => {
    let sql = "SELECT l.* FROM letter l WHERE l.sender_id = ? ";
    let params = [currentUserId];
    if (keyWord) {
      sql += " and (l.title like ? or l.message like ?)";
      params.push(`%${keyWord}%`, `%${keyWord}%`);
    }
    if (beginDate && endDate) {
      sql += ` and l.create_time between ? and ?`;
      params.push(beginDate + ' 00:00:00', endDate + ' 23:59:59');
    }
    if (tagIds && tagIds.length > 0) {
      sql +=
        " and l.id in (select letter_id from letter_tag where tag_id IN (?))";
      params.push(tagIds);
    }
    if (status !== '') {
      sql += " and l.status = ?";
      params.push(status);
    }
    sql += " order by l.create_time desc limit ?,?";
    params.push(start, limit);
    return conn.query(sql, params);
  },
  // 接受副本
  queryReceiveLetters: async ({
    conn,
    currentUserId,
    start,
    limit,
    keyWord,
    beginDate,
    endDate,
    status,
    tagIds
  }) => {
    let sql = "SELECT l.*, lr.read FROM letter l LEFT JOIN letter_receiver lr ON l.id = lr.letter_id WHERE lr.user_id = ? and lr.type = 2";
    let params = [currentUserId];
    if (keyWord) {
      sql += " and (l.title like ? or l.message like ?)";
      params.push(`%${keyWord}%`, `%${keyWord}%`);
    }
    if (beginDate && endDate) {
      sql += ` and l.create_time between ? and ?`;
      params.push(beginDate + ' 00:00:00', endDate + ' 23:59:59');
    }
    if (tagIds && tagIds.length > 0) {
      sql +=
        " and l.id in (select letter_id from letter_tag where tag_id IN (?))";
      params.push(tagIds);
    }
    if (status !== '') {
      // sql += " and l.id in (select letter_id from letter_receiver where is_signing = ? and user_id = ? and type = 1)";
      // params.push(status, currentUserId);
      sql += " and l.status = ?";
      params.push(status);
    }
    sql += " order by l.create_time desc limit ?,?";
    params.push(start, limit);
    return conn.query(sql, params);
  },
  // 全部文件
  queryAllLetters: async ({
    conn,
    currentUserId,
    start,
    limit,
    keyWord,
    beginDate,
    endDate,
    status,
    tagIds
  }) => {
    let sql = "SELECT distinct l.* FROM letter l LEFT JOIN letter_receiver lr ON l.id = lr.letter_id WHERE (lr.user_id = ? or l.sender_id = ?)";
    let params = [currentUserId, currentUserId];
    if (keyWord) {
      sql += " and (l.title like ? or l.message like ?)";
      params.push(`%${keyWord}%`, `%${keyWord}%`);
    }
    if (beginDate && endDate) {
      sql += ` and l.create_time between ? and ?`;
      params.push(beginDate + ' 00:00:00', endDate + ' 23:59:59');
    }
    if (tagIds && tagIds.length > 0) {
      sql +=
        " and l.id in (select letter_id from letter_tag where tag_id IN (?))";
      params.push(tagIds);
    }
    if (status !== '') {
      sql += " and l.status = ?";
      params.push(status);
    }
    sql += " order by l.create_time desc limit ?,?";
    // console.log(sql, params)
    params.push(start, limit);
    return conn.query(sql, params);
  }
};
