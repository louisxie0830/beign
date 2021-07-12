'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');
//  BASE_URL: '"https://backend-signing-test.beingtech.org"'
module.exports = merge(prodEnv, {
    DEPLOY_ENV: '"development"',
    //BASE_URL: '"https://backend-signing-test.beingtech.org"'
    // BASE_URL: '"http://localhost:8080"'
    BASE_URL: '"https://gw-signing-test.beingtech.org"'
});
