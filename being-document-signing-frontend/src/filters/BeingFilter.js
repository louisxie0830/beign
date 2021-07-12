import Vue from 'vue';
// const PhoneNumber = require('awesome-phonenumber');

const dateformat = (value, formatString) => {
  if (!value) return '';
  return moment(value).format(formatString);
};

const formatPhoneNumber = (phone, countryCode, formatCode) => {
  countryCode = countryCode || 'TW';
  formatCode = formatCode || 'significant';
  let pn = new PhoneNumber(phone, countryCode);
  return pn.getNumber(formatCode);
};

const trim = value => {
  if (!value) return;
  return value.replace(/(^\s*)|(\s*$)/g, '');
};

const filters = {
  dateformat,
  formatPhoneNumber,
  trim
};

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

export default filters;
