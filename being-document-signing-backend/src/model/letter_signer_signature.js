module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "letterSignerSignature",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      letterId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "letter_id"
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "user_id"
      },
      letterFileKey: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "letter_file_key"
      },
      pageNo: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: false,
        field: "page_no"
      },
      positionX: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: false,
        field: "position_x"
      },
      positionY: {
        type: DataTypes.INTEGER(5).UNSIGNED,
        allowNull: false,
        field: "position_y"
      },
      color: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "color"
      },
      pngContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "png_content"
      }
    },
    {
      tableName: "letter_signer_signature"
    }
  );
};
