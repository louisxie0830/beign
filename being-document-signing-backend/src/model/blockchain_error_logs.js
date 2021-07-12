module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "blockchainErrorLogs",
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      transactionObject: {
        type: DataTypes.STRING(4096),
        allowNull: true,
        field: "transaction_object"
      },
      contractParams: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        field: "contract_params"
      },
      code: {
        type: DataTypes.STRING(256),
        allowNull: true,
        field: "code"
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "message"
      },
      stack: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "stack"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "created_at"
      }
    },
    {
      tableName: "blockchain_error_logs"
    }
  );
};
