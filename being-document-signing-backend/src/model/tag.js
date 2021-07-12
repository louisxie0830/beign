module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tag",
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
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "name"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "created_at"
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "1",
        field: "status"
      }
    },
    {
      tableName: "tag"
    }
  );
};
