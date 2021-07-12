module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "letterDraft",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
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
      letterSigner: {
        type: DataTypes.STRING(2000),
        allowNull: true,
        defaultValue: "",
        field: "letter_signer"
      },
      letterViewer: {
        type: DataTypes.STRING(2000),
        allowNull: true,
        defaultValue: "",
        field: "letter_viewer"
      },
      letterFile: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "letter_file"
      },
      tagName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        field: "tag_name"
      },
      creatorSign: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "creator_sign"
      },
      enableSmsNotify: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "enable_sms_notify"
      }
    },
    {
      tableName: "letter_draft"
    }
  );
};
