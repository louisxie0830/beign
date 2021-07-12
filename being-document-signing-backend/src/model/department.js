module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "department",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      companyId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "company_id"
      },
      adminId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "admin_id"
      },
      name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "",
        field: "name"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "updated_at"
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "1",
        field: "status"
      }
    },
    {
      tableName: "department"
    }
  );
};
