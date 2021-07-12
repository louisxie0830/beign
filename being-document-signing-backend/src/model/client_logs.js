module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "clientLogs",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      fileName: {
        type: DataTypes.STRING(256),
        allowNull: true,
        field: "fileName"
      },
      errorLine: {
        type: DataTypes.STRING(11),
        allowNull: true,
        field: "errorLine"
      },
      errorCode: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: "errorCode"
      },
      errorMsg: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        field: "errorMsg"
      },
      uri: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        field: "uri"
      },
      stackTrace: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "stackTrace"
      },
      createdTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "created_time"
      }
    },
    {
      tableName: "client_logs"
    }
  );
};
