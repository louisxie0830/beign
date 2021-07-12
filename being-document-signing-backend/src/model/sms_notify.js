module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "smsNotify",
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      letterId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "letter_id"
      },
      smsId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: "",
        field: "sms_id"
      },
      smsContent: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: "",
        field: "sms_content"
      },
      receiver: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: "",
        field: "receiver"
      },
      sendAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "send_at"
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "0",
        field: "status"
      }
    },
    {
      tableName: "sms_notify"
    }
  );
};
