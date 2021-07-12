"use strict";

const { web3 } = require("./web3-client");
const Boom = require("@hapi/boom");
const Hoek = require("@hapi/hoek");
const Joi = require("@hapi/joi");

// Declare Internals

const internals = {};

internals.defaults = {
  accessTokenName: "access_token",
  allowQueryToken: false,
  allowCookieToken: false,
  allowMultipleHeaders: false,
  allowChaining: false,
  tokenType: "Bearer",
  unauthorized: Boom.unauthorized
};

internals.schema = Joi.object().keys({
  validate: Joi.func().required(),
  accessTokenName: Joi.string().required(),
  allowQueryToken: Joi.boolean(),
  allowCookieToken: Joi.boolean(),
  allowMultipleHeaders: Joi.boolean(),
  allowChaining: Joi.boolean(),
  tokenType: Joi.string().required(),
  unauthorized: Joi.func()
});

internals.implementation = (server, options) => {
  Hoek.assert(options, "Missing bearer auth strategy options");

  const settings = Hoek.applyToDefaults(internals.defaults, options);
  Joi.assert(settings, internals.schema);

  const headerRegExp = new RegExp(settings.tokenType + "\\s+([^;$]+)", "i");

  const scheme = {
    payload: async (request, h) => {
      const tags = request.route.settings.tags;
      const timestamp = request.headers.timestamp;
      const signature = request.headers.signature;
      const address = request.headers.address;
      const message = JSON.stringify(request.payload) + "@" + timestamp;
      let serverTime = Date.now();
      const diffTime = serverTime - timestamp;
      if (!timestamp || diffTime < 0 || diffTime > 60000 || !address) {
        throw Boom.unauthorized("THE_SIGNATURE_IS_EXPIRED");
      } else {
        let credentials_address = request.auth.credentials.address;
        if (tags.indexOf("sign_password") >= -1) {
          credentials_address = address;
        } else if (!credentials_address) {
          request.log("error", "not exist credentials_address");
          throw Boom.unauthorized("THE_SIGNATURE_IS_NOT_MATCH_THE_ADDRESS");
        }
        try {
          request.log("message", message);
          const a = web3.eth.accounts.recover(message, signature).toLowerCase();
          const b = address.toLowerCase();
          const c = credentials_address.toLowerCase();
          request.log("recover address", a);
          request.log("header address", b);
          request.log("stored address", c);
          if (b !== c || b !== a) {
            request.log("error", "miss match");
            throw Boom.unauthorized("THE_SIGNATURE_IS_NOT_MATCH_THE_ADDRESS");
          }
        } catch (e) {
          request.log("error", e);
          throw Boom.unauthorized("THE_SIGNATURE_IS_NOT_MATCH_THE_ADDRESS");
        }
      }
      return h.continue;
    },
    authenticate: async (request, h) => {
      let authorization = request.raw.req.headers.authorization;

      if (
        settings.allowCookieToken &&
        !authorization &&
        request.state[settings.accessTokenName]
      ) {
        authorization = `${settings.tokenType} ${
          request.state[settings.accessTokenName]
        }`;
      }

      if (
        settings.allowQueryToken &&
        !authorization &&
        request.query[settings.accessTokenName]
      ) {
        authorization = `${settings.tokenType} ${
          request.query[settings.accessTokenName]
        }`;
        delete request.query[settings.accessTokenName];
      }

      if (!authorization) {
        return settings.unauthorized(null, settings.tokenType);
      }

      if (settings.allowMultipleHeaders) {
        const headers = authorization.match(headerRegExp);
        if (headers !== null) {
          authorization = headers[0];
        }
      }

      const [tokenType, token] = authorization.split(/\s+/);

      if (
        !token ||
        tokenType.toLowerCase() !== settings.tokenType.toLowerCase()
      ) {
        throw settings.unauthorized(null, settings.tokenType);
      }

      const { isValid, credentials, artifacts } = await settings.validate(
        request,
        token,
        h
      );

      if (!isValid) {
        let message = "Bad token";
        if (settings.allowChaining) {
          const routeSettings = request.route.settings.auth;
          const auth =
            routeSettings || request.server.auth.lookup(request.route);
          if (auth.strategies.length > 1) {
            message = null;
          }
        }

        return h.unauthenticated(
          settings.unauthorized(message, settings.tokenType),
          {
            credentials,
            artifacts
          }
        );
      }

      if (!credentials || typeof credentials !== "object") {
        throw h.unauthenticated(
          Boom.badImplementation(
            "Bad token string received for Bearer auth validation"
          ),
          {
            credentials: {}
          }
        );
      }

      return h.authenticated({
        credentials,
        artifacts
      });
    }
  };

  return scheme;
};

exports.plugin = {
  name: "custom-bearer-token-auth",
  version: "1.0.0",
  register: (server, options) =>
    server.auth.scheme("custom-bearer-token-auth", internals.implementation)
};
