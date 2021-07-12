module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "companyAuthorized",
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
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "user_id"
      },
      role: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "role"
      },
      status: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "status"
      },
      authorizerSignatureId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "authorizer_signature_id"
      },
      cancelSignatureId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "cancel_signature_id"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_time"
      },
      stopTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "stop_time"
      }
    },
    {
      tableName: "company_authorized"
    }
  );
};
