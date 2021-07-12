const { Server } = require("@hapi/hapi");
const Handlebars = require("handlebars");
const helpers = require("handlebars-helpers")();
Handlebars.registerHelper(helpers);
const Routes = require("./route");
const Plugins = require("./plugins");
const Config = require("./config");
const AuthStrategy = require("./auth-strategy");
const ErrorCodes = require("./libs/errorCodes");

const init = async () => {
  const server = new Server(Config);
  await server.register(Plugins);
  server.auth.strategy("simple", "custom-bearer-token-auth", AuthStrategy);
  server.auth.default("simple");
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    // const lang = request.getLocale(); // 获取语系

    if (response.isBoom) {
      const statusCode = response.output.statusCode;
      request.log("global_error_handling", response);
      if (statusCode === 413) {
        const json = {
          code: 98005,
          message: ErrorCodes["zh_cn"]["98005"]
        };
        return h
          .response(json)
          .code(200)
          .takeover();
      } else {
        const json = {
          code: statusCode,
          message: response.message
        };
        return h
          .response(json)
          .code(200)
          .takeover();
      }
    }

    return h.continue;
  });
  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: "../templates"
  });
  server.route(Routes);
  await server.initialize();
  return server;
};

module.exports = init;
