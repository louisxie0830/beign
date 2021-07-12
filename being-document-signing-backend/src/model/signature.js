module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "signature",
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
      targetType: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "target_type"
      },
      targetId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "target_id"
      },
      signerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "signer_id"
      },
      signerCompanyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: "0",
        field: "signer_company_id"
      },
      signerAddress: {
        type: DataTypes.STRING(42),
        allowNull: false,
        defaultValue: "",
        field: "signer_address"
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "message"
      },
      signature: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "signature"
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "payload"
      },
      tx: {
        type: DataTypes.STRING(66),
        allowNull: true,
        field: "tx"
      },
      send: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: "0",
        field: "send"
      },
      status: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: "0",
        field: "status"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_time"
      }
    },
    {
      tableName: "signature"
    }
  );
};
