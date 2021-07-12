module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "orderList",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        defaultValue: "",
        field: "uuid"
      },
      orderId: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        unique: true,
        field: "order_id"
      },
      packageId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "",
        field: "package_id"
      },
      packageName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
        field: "package_name"
      },
      amount: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        field: "amount"
      },
      currency: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: "",
        field: "currency"
      },
      unitPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "unit_price"
      },
      totalPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "total_price"
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
      remark: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        field: "remark"
      },
      paymentMethod: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "",
        field: "payment_method"
      },
      paymentOrderId: {
        type: DataTypes.STRING(128),
        allowNull: true,
        field: "payment_order_id"
      },
      paymentResult: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        field: "payment_result"
      },
      orderStatus: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        field: "order_status"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at"
      },
      modifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "modified_at"
      }
    },
    {
      tableName: "order_list"
    }
  );
};
