module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "fileVerify",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: "",
        unique: true,
        field: "uuid"
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "user_id"
      },
      fileHash: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: "",
        field: "file_hash"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "create_time"
      },
      ip: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: "",
        field: "ip"
      },
      userAgent: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: "",
        field: "user_agent"
      },
      signingStatus: {
        type: DataTypes.INTEGER(2),
        allowNull: true,
        field: "signing_status"
      }
    },
    {
      tableName: "file_verify"
    }
  );
};
