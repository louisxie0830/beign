module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "letterFile",
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
      letterId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "letter_id"
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
        field: "url"
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
        field: "name"
      },
      size: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        field: "size"
      },
      type: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "",
        field: "type"
      },
      hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "hash"
      },
      order: {
        type: DataTypes.INTEGER(6).UNSIGNED,
        allowNull: false,
        field: "order"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_time"
      }
    },
    {
      tableName: "letter_file"
    }
  );
};
