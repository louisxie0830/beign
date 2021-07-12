// import Web3 from 'web3';
import crypto from 'crypto-js';
import { WEB3_ERROR_STATUS } from './status';
import i18n from './../plugins/i18n';

class EncryptionFactory {
  constructor() {
    this.web3Util = null;
    if (typeof Web3 !== 'undefined') {
      this.web3Util = new Web3(Web3.currentProvider);
    }
    this.errorCode = WEB3_ERROR_STATUS;
    this.status = 200;
  }

  async privateKey(mail) {
    console.log('mail: ', mail);
    try {
      if (!mail) {
        throw {
          data: {
            code: this.errorCode.MAIL_IS_NOT_EXIST,
            message: i18n.t('common_email_address_error.text')
          },
          status: this.status
        };
      }
      return Web3.utils.sha3(Array(1000).join(`${mail}${crypto.lib.WordArray.random(256).toString()}`));
    } catch (error) {
      console.error('error: ', error);
      throw {
        data: {
          code: this.errorCode.PRIVATE_KEY_IS_NOT_EXIST,
          message: i18n.t('common_private_key_error.text')
        },
        status: this.status
      };
    }
  }

  async secretKey(mail, voucherPwd) {
    console.log('voucherPwd: ', voucherPwd);
    console.log('mail: ', mail);
    try {
      if (!mail) {
        throw {
          data: {
            code: this.errorCode.MAIL_IS_NOT_EXIST,
            message: i18n.t('common_email_address_error.text')
          },
          status: this.status
        };
      }
      if (!voucherPwd) {
        throw {
          data: {
            code: this.errorCode.VOUCHER_IS_NOT_EXIST,
            message: i18n.t('common_voucher_password_error.text')
          },
          status: this.status
        };
      }
      return crypto
        .PBKDF2(voucherPwd, mail, {
          keySize: 512 / 32,
          iterations: 1000
        })
        .toString();
    } catch (error) {
      console.error(error);
      throw {
        data: {
          code: this.errorCode.SECRET_KEY_IS_NOT_EXIST,
          message: i18n.t('common_secret_key_error.text')
        },
        status: this.status
      };
    }
  }

  async cerPwd(privateKey, secretKey) {
    console.log('secretKey: ', secretKey);
    console.log('privateKey: ', privateKey);
    try {
      if (!privateKey) {
        throw {
          data: {
            code: this.errorCode.PRIVATE_KEY_IS_NOT_EXIST,
            message: i18n.t('common_voucher_password_error.text')
          },
          status: this.status
        };
      }
      if (!secretKey) {
        throw {
          data: {
            code: this.errorCode.SECRET_KEY_IS_NOT_EXIST,
            message: i18n.t('common_voucher_password_error.text')
          },
          status: this.status
        };
      }
      return crypto.AES.encrypt(privateKey, secretKey).toString();
    } catch (error) {
      console.error(error);
      throw {
        data: {
          code: this.errorCode.CER_PASSWORD_IS_NOT_EXIST,
          message: i18n.t('common_cer_password_error.text')
        },
        status: this.status
      };
    }
  }

  async decrypted(cerPwd, secretKey) {
    try {
      if (!cerPwd) {
        throw {
          data: {
            code: this.errorCode.CER_PASSWORD_IS_NOT_EXIST,
            message: i18n.t('common_voucher_password_error.text')
          },
          status: this.status
        };
      }
      if (!secretKey) {
        throw {
          data: {
            code: this.errorCode.SECRET_KEY_IS_NOT_EXIST,
            message: i18n.t('common_voucher_password_error.text')
          },
          status: this.status
        };
      }
      let decode = crypto.AES.decrypt(cerPwd, secretKey);
      if (decode.toString(crypto.enc.Utf8)) {
        return await decode.toString(crypto.enc.Utf8);
      } else {
        throw {
          data: {
            code: this.errorCode.DECRYPTED_DATA_IS_NOT_EXIST,
            message: i18n.t('common_voucher_password_error.text')
          },
          status: this.status
        };
      }
    } catch (error) {
      console.error('error: ', error);
      throw {
        data: {
          code: this.errorCode.DECRYPTED_DATA_IS_NOT_EXIST,
          message: i18n.t('common_voucher_password_error.text')
        },
        status: this.status
      };
    }
  }

  async address(privateKey) {
    try {
      if (!privateKey) {
        throw {
          data: {
            code: this.errorCode.PRIVATE_KEY_IS_NOT_EXIST,
            message: i18n.t('common_private_key_error.text')
          },
          status: this.status
        };
      }
      return this.web3Util.eth.accounts.privateKeyToAccount(privateKey).address;
    } catch (error) {
      console.error(error);
    }
  }

  async signature(payload, address) {
    try {
      if (!payload) {
        throw {
          data: {
            code: this.errorCode.SIGNATURE_DATA_IS_NOT_EXIST,
            message: i18n.t('common_sign_data.error.text')
          },
          status: this.status
        };
      }
      if (!address) {
        throw {
          data: {
            code: this.errorCode.ADDRESS_IS_NOT_EXIST,
            message: i18n.t('common_address_error.text')
          },
          status: this.status
        };
      }
      return this.web3Util.eth.accounts.sign(payload, address).signature;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new EncryptionFactory();
