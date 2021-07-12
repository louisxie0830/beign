module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "letterReceiver",
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
      letterId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "letter_id"
      },
      receiverCompanyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: "0",
        field: "receiver_company_id"
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "user_id"
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "",
        field: "email"
      },
      type: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "type"
      },
      isSigning: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "is_signing"
      },
      order: {
        type: DataTypes.INTEGER(6).UNSIGNED,
        allowNull: false,
        field: "order"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_time"
      },
      read: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "read"
      },
      viewFile: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "view_file"
      },
      comment: {
        type: DataTypes.STRING(300),
        allowNull: true,
        field: "comment"
      },
      signTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "sign_time"
      }
    },
    {
      tableName: "letter_receiver"
    }
  );
};
