module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "company",
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
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
        field: "name"
      },
      url: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: "",
        field: "url"
      },
      applicantId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: "0",
        field: "applicant_id"
      },
      status: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "status"
      },
      signingQuota: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: "0",
        field: "signing_quota"
      },
      signingRemain: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: "signing_remain"
      },
      signingDueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "signing_due_date"
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
      tableName: "company"
    }
  );
};
