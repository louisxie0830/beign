module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "contact",
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
      ownerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "owner_id"
      },
      contactEmail: {
        type: DataTypes.STRING(254),
        allowNull: false,
        defaultValue: "",
        field: "contact_email"
      },
      contactName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "contact_name"
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_time"
      }
    },
    {
      tableName: "contact"
    }
  );
};
