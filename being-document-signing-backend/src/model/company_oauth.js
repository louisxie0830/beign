module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "companyOauth",
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
      sourceName: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "",
        field: "source_name"
      },
      sourceCompanyId: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "source_company_id"
      },
      status: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "status"
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
      tableName: "company_oauth"
    }
  );
};
