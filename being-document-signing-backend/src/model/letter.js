module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "letter",
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
      senderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "sender_id"
      },
      companyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "company_id"
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
        field: "title"
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "message"
      },
      progress: {
        type: DataTypes.INTEGER(6).UNSIGNED,
        allowNull: false,
        field: "progress"
      },
      status: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "status"
      },
      cancelerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "canceler_id"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_time"
      },
      expiredTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "expired_time"
      },
      emailSwitch: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "email_switch"
      },
      comment: {
        type: DataTypes.STRING(300),
        allowNull: true,
        field: "comment"
      },
      withdrawTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "withdraw_time"
      },
      enableSmsNotify: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "enable_sms_notify"
      },
      completeTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "complete_time"
      }
    },
    {
      tableName: "letter"
    }
  );
};
