module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "user",
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
      mobile: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "",
        field: "mobile"
      },
      mobileVerify: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "",
        field: "mobile_verify"
      },
      mobileVerifyTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "mobile_verify_time"
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: true,
        field: "password"
      },
      passwordErrorCount: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        field: "password_error_count"
      },
      passwordResetLinkHash: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: "password_reset_link_hash"
      },
      cerPwd: {
        type: DataTypes.STRING(128),
        allowNull: true,
        field: "cer_pwd"
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "name"
      },
      idNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "id_number"
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        defaultValue: "",
        field: "email"
      },
      emailCrc: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: "0",
        field: "email_crc"
      },
      emailVerify: {
        type: DataTypes.STRING(254),
        allowNull: false,
        defaultValue: "",
        field: "email_verify"
      },
      emailVerifyTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "email_verify_time"
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        field: "status"
      },
      birthday: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "birthday"
      },
      gender: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "gender"
      },
      registerIp: {
        type: DataTypes.STRING(46),
        allowNull: true,
        field: "register_ip"
      },
      registerTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "register_time"
      },
      lastLoginTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_login_time"
      },
      verifyCode: {
        type: DataTypes.STRING(4),
        allowNull: true,
        field: "verify_code"
      },
      verifyCodeSendCount: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "verify_code_send_count"
      },
      verifyCodeErrorCount: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "verify_code_error_count"
      },
      verifyCodeStatus: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "verify_code_status"
      },
      verifyCodeCreateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "verify_code_create_time"
      },
      languageCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "language_code"
      },
      verifyCodeExpiredTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "verify_code_expired_time"
      }
    },
    {
      tableName: "user"
    }
  );
};
