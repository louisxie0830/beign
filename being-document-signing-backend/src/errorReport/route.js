module.exports = [
  {
    method: "POST",
    path: "/error/report",
    handler: async (request, h) => {
      const pool = request.mysql.pool;
      if (request.payload) {
        const fileName = request.payload.fileName;

        const errorLine = request.payload.errorLine;

        const errorCode = request.payload.errorCode;

        const errorMsg = request.payload.errorMsg;

        const uri = request.payload.uri;

        const stackTrace = request.payload.stackTrace;
        const insertSignatureSql =
          "INSERT INTO `client_logs`(`fileName`, `errorLine`, `errorCode`, `errorMsg`, `uri`, `stackTrace`, `created_time`) VALUES  (?, ?, ?, ?, ?, ?, ?)";
        try {
          await pool.query(insertSignatureSql, [
            fileName,
            errorLine,
            errorCode,
            errorMsg,
            uri,
            stackTrace,
            new Date()
          ]);
        } catch (e) {
          request.log("tag: /error/report", e);
        }
      }
      return {
        code: 200,
        message: "ok"
      };
    },
    options: {
      auth: false,
      notes: "错误报告",
      description: "错误报告",
      tags: ["api", "error", "report"]
    }
  }
];
