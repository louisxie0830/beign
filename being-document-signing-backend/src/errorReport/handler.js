const Boom = require('boom');

module.exports = {
  notImplemented: async (request) => {

    throw Boom.notImplemented("not implemented");
  }
};