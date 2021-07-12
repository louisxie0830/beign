const path = require('path');
module.exports = [
  {
    method: "GET",
    path: "/static/{param*}",
    options: {
      auth: false,
      handler: {
        directory: {
          path: path.join(__dirname, '../../static')
        }
      }
    }
  }
];
