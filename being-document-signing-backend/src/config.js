const CustomErrorMessage = require("./libs/customValidateError");
module.exports = {
  port: process.env.BIND_PORT,
  host: process.env.BIND_HOST,
  routes: {
    validate: {
      failAction: async (request, h, err) => {
        const lang = request.getLocale(); // 获取语系
        if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
          const invalidItem = err.details[0];
          const type = invalidItem.type;
          const key = invalidItem.context.key;
          const path = request.path;
          // request.log('failAction', invalidItem);
          let message = invalidItem.message;
          const json = {
            code: 400,
            message: message
          };
          return h
            .response(CustomErrorMessage(path, key, type, json, lang))
            .code(200)
            .takeover();
        } else {
          const json = {
            code: 500,
            message: "SERVER ERROR"
          };
          return h
            .response(json)
            .code(200)
            .takeover();
        }
      }
    },
    cors: {
      origin: ["*"],
      credentials: true,
      additionalHeaders: [
        "cache-control",
        "x-requested-with",
        "address",
        "timestamp",
        "signature",
        "accept-language",
        "x-being-area"
      ]
    }
  }
};
