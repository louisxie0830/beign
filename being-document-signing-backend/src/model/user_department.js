module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "userDepartment",
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
        allowNull: false,
        field: "department_id"
      },
      isAdmin: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        field: "is_admin"
      },
      status: {
        type: DataTypes.INTEGER(1).UNSIGNED,
        allowNull: false,
        field: "status"
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
      }
    },
    {
      tableName: "user_department"
    }
  );
};
