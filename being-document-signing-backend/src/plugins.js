const Inert = require("@hapi/inert");
const Path = require("path");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Good = require("@hapi/good");
const Mysql2 = require("hapi-mysql2");
const Redis2 = require("hapi-redis2");
const AuthBearer = require("./libs/custom-bearer-token-auth");
const HapiLocale = require("./libs/hapi-local");
const { createPlugin } = require("@promster/hapi");
const { Sequelize } = require("sequelize");
const prometheusOptions = {};
const redisOptions = {
  decorate: true,
  settings: {
    port: process.env.REDIS_PORT, // Redis port
    host: process.env.REDIS_HOST, // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: process.env.REDIS_PASSWORD,
    db: 0
  }
};
const goodOptions = {
  ops: false,
  reporters: {
    myConsoleReporter: [
      {
        module: "@hapi/good-console"
      },
      "stdout"
    ]
  }
};
const mysqlOptions = {
  settings: {
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  },
  decorate: true
};

const sequelizeOpt = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DB,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  dialect: "mysql",
  dialectOptions: {
    timezone: "+00:00"
  },
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    timestamps: false,
    underscored: false
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: "+00:00",
  logging: sql => {
    console.log("SQL:", sql);
  }
};

module.exports = [
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: {
      schemes: ["https", "http"],
      info: {
        title: "必應文件及協議簽署服務",
        version: "0.0.1",
        description: "Backend APIs"
      }
    }
  },
  {
    plugin: HapiLocale,
    options: {
      locales: ["zh_tw", "zh_cn", "en_us"],
      getter: "getLocale",
      setter: "setLocale"
    }
  },
  AuthBearer,
  {
    plugin: Good,
    options: goodOptions
  },
  {
    plugin: Mysql2,
    options: mysqlOptions
  },
  {
    plugin: Redis2,
    options: redisOptions
  },
  {
    plugin: require("hapi-sequelizejs"),
    options: [
      {
        name: "main", // identifier
        models: [Path.join(__dirname, "/model/*.js")], // paths/globs to model files
        // ignoredModels: [__dirname + "/server/models/**/*.js"], // OPTIONAL: paths/globs to ignore files
        sequelize: new Sequelize(sequelizeOpt), // sequelize instance
        sync: false, // sync models - default false
        forceSync: false // force sync (drops tables) - default false
      }
    ]
  },
  createPlugin(prometheusOptions)
];
