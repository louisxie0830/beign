module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "invoice",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      orderId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "order_id"
      },
      type: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "type"
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: "name"
      },
      mobile: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "mobile"
      },
      address: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: "address"
      },
      title: {
        type: DataTypes.STRING(60),
        allowNull: true,
        field: "title"
      },
      taxId: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "tax_id"
      },
      corpId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "corp_id"
      },
      invoiceNo: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "invoice_no"
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "user_id"
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "email"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "created_at"
      },
      invoiceAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "invoice_at"
      }
    },
    {
      tableName: "invoice"
    }
  );
};
