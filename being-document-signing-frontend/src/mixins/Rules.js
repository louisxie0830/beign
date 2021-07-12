// const PhoneNumber = require('awesome-phonenumber');
const rules = (function() {
  String.prototype.Blength = function() {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
      this.charCodeAt(i) < 256 ? len++ : (len += 2); // charCode大於256代表是全形字串
    }
    return len;
  };
  const checkDigitString = value => /^([0-9])*$/.test(value);
  const checkPhoneNumberFormat = (phone, countryCode) => {
    countryCode = countryCode || 'TW';
    let pn = new PhoneNumber(phone, countryCode);
    return pn.isValid() && checkDigitString(phone);
  };
  const checkPhoneNumber = (v, text, countryCode) => {
    return v => (v && !!checkPhoneNumberFormat(v, countryCode)) || text;
  };

  const checkRequired = (v, text) => v => !!v || text;
  const reconfirm = (v, diffValue, text) => v => (v && v === diffValue) || text;
  const minLength = (v, minLength, text) => v => (v && v.length >= minLength) || text;
  const maxLength = (v, maxLength, text) => v => (v && v.length <= maxLength) || text;
  const checkPasswordFormat = (() => {
    const regExpEngAndNum = /^(?=.*\d)(?=.*[a-zA-Z])([0-9a-zA-Z]){8,32}$/;
    return (v, text) => {
      return v => regExpEngAndNum.test(v) || text;
    };
  })();
  const checkByteMaxLength = (v, maxLength, text) => v => (v && v.Blength() <= maxLength) || text;
  const onlyCnAndEng = (() => {
    const regExpCnAndEn = /^[\u4e00-\u9fa5a-zA-Z\s\.]+$/;
    return (v, text) => v => (v && regExpCnAndEn.test(v)) || text;
  })();

  return function() {
    const name = function() {
      return [
        checkRequired(this.v, this.$t('common.name_placeholder')),
        maxLength(this.v, 12, this.$t('common.password_rules.max_length', ['十二'])),
        onlyCnAndEng(this.v, this.$t('common.only_cn_and_en'))
      ];
    };
    const certCode = function() {
      return [checkRequired(this.v, this.$t('common.cert_code_placeholder'))];
    };
    const confirmCertCode = function(value) {
      return [
        checkRequired(this.v, this.$t('common.cert_code_again_confirm')),
        reconfirm(this.v, value, this.$t('common.cert_code_diff')),
        minLength(this.v, 8, this.$t('common.password_rules.min_length', ['八'])),
        maxLength(this.v, 32, this.$t('common.password_rules.max_length', ['三十二'])),
        checkPasswordFormat(this.v, this.$t('common.password_rules.need_minxed'))
      ];
    };
    const authCode = function() {
      return [
        checkRequired(this.v, this.$t('common.verify_code_placeholder')),
        minLength(this.v, 6, this.$t('common.password_rules.min_length', ['六']))
      ];
    };
    const password = function() {
      return [
        checkRequired(this.v, this.$t('common.password_placeholder')),
        minLength(this.v, 8, this.$t('common.password_rules.min_length', ['八'])),
        maxLength(this.v, 32, this.$t('common.password_rules.max_length', ['三十二'])),
        checkPasswordFormat(this.v, this.$t('common.password_rules.need_minxed'))
      ];
    };
    const confirmPassword = function(value) {
      return [
        checkRequired(this.v, this.$t('common.password_placeholder')),
        minLength(this.v, 8, this.$t('common.password_rules.min_length', ['八'])),
        maxLength(this.v, 32, this.$t('common.password_rules.max_length', ['三十二'])),
        checkPasswordFormat(this.v, this.$t('common.password_rules.need_minxed')),
        reconfirm(this.v, value, this.$t('common.password_rules.confrim_diff'))
      ];
    };
    const email = function() {
      const checkEmail = (() => {
        const regExpEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        return (v, text) => v => (v && regExpEmail.test(v.trim())) || text;
      })();
      return [
        checkRequired(this.v, this.$t('common.mail_placeholder')),
        checkEmail(this.v, this.$t('common.email_rules.format'))
      ];
    };
    const bLength = function(maxLength) {
      return [
        checkRequired(this.v, this.$t('common.tag_name.input_name')),
        checkByteMaxLength(this.v, maxLength, this.$t('common.byte_max_length.text', [maxLength]))
      ];
    };
    const address = function() {
      return [checkRequired(this.v, this.$t('purchase.invoice.address.text'))];
    };
    const phone = function(countryCode) {
      return [
        checkRequired(this.v, this.$t('common.phone_placeholder')),
        checkPhoneNumber(this.v, this.$t('common.phone_rules.format'), countryCode)
      ];
    };

    const invoiceTitle = function() {
      return [checkRequired(this.v, this.$t('purchase.invoice.title.placeholder'))];
    };
    const invoice = function() {
      return [
        v => !!v || this.$t('purchase.invoice.no.placeholder'),
        v => (!!v && /^[0-9]*$/.test(v)) || this.$t('purchase_result.invoice.tip'),
        v => (v && v.length >= 8) || this.$t('purchase.invoice.error.text')
      ];
    };

    const countryCodes = function() {
      return [checkRequired(this.v, this.$t('common.country_code_rules.input_code'))];
    };

    const departmentName = function() {
      return [
        checkRequired(this.v, this.$t('common.department_name_rules.input_code')),
        minLength(this.v, 3, this.$t('common.password_rules.min_length', [3])),
        checkByteMaxLength(this.v, 20, this.$t('common.byte_max_length.text', [20]))
      ];
    };

    const message = function() {
      return [checkRequired(this.v, this.$t('reportmessage'))];
    };

    return {
      name: name.apply(this),
      certCode: certCode.apply(this),
      confirmCertCode: confirmCertCode.bind(this),
      authCode: authCode.apply(this),
      password: password.apply(this),
      confirmPassword: confirmPassword.bind(this),
      email: email.apply(this),
      bLength: bLength.bind(this),
      address: address.apply(this),
      phone: phone.bind(this),
      invoiceTitle: invoiceTitle.apply(this),
      invoice: invoice.apply(this),
      countryCodes: countryCodes.apply(this),
      departmentName: departmentName.apply(this),
      message: message.apply(this)
    };
  };
})();

export default {
  data() {
    return {
      rules: rules.apply(this),
      authCodeBtnStatus: false
    };
  },
  methods: {
    clickAuthCodeBtn() {
      this.authCodeBtnStatus = true;
    },
    formatPhoneNumber(phone, countryCode) {
      if (!phone) return;
      countryCode = countryCode || 'TW';
      let pn = new PhoneNumber(phone, countryCode);
      return pn.getNumber('significant');
    }
  },
  mounted() {},
  destroyed() {}
};
