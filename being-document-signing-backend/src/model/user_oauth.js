module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "userOauth",
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
        field: "uuid"
      },
      companyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "company_id"
      },
      thirdId: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "third_id"
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "user_id"
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
        field: "name"
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        defaultValue: "",
        field: "email"
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "",
        field: "type"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_time"
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_login"
      },
      status: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "status"
      }
    },
    {
      tableName: "user_oauth"
    }
  );
};
