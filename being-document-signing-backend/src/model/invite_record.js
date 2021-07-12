module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "inviteRecord",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "user_id"
      },
      companyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "company_id"
      },
      departmentId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "department_id"
      },
      name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "",
        field: "name"
      },
      mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "",
        field: "mobile"
      },
      expiredTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expired_time"
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "",
        field: "email"
      },
      country: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "country"
      },
      city: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "city"
      },
      positionName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "",
        field: "position_name"
      },
      inviteCode: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "invite_code"
      },
      useBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "use_by"
      }
    },
    {
      tableName: "invite_record"
    }
  );
};
