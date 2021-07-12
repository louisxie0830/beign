module.exports = function(sequelize, DataTypes) {
  const letterTag = sequelize.define(
    "letterTag",
    {
      tagId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        field: "tag_id"
      },
      letterId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        field: "letter_id"
      }
    },
    {
      tableName: "letter_tag"
    }
  );
  letterTag.removeAttribute("id");
  return letterTag;
};
