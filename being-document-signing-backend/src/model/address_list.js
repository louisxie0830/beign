module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "addressList",
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
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "user_id"
      },
      address: {
        type: DataTypes.STRING(42),
        allowNull: false,
        defaultValue: "",
        field: "address"
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
      tableName: "address_list"
    }
  );
};
