module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "contactInfo",
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "username"
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: "",
        field: "uuid"
      },
      message: {
        type: DataTypes.STRING(300),
        allowNull: true,
        field: "message"
      },
      createTime: {
        type: DataTypes.TIME,
        allowNull: true,
        field: "create_time"
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        defaultValue: "",
        field: "email"
      }
    },
    {
      tableName: "contact_info"
    }
  );
};
