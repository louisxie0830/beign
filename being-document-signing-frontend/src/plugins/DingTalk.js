import { DING_TALK_ERROR_STATUS } from './../utils/status';
const status = 200;
class DingClient {
  getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }
  regDingTalkData(agentId, corpId, timeStamp, nonceStr, signature) {
    return {
      agentId: Number(agentId),
      corpId: corpId,
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: [
        'biz.util.openLink',
        'device.launcher.launchApp',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.chat.chooseConversation',
        'biz.ding.post',
        'biz.user.get'
      ]
    };
  }
  ddConfig(param) {
    return new Promise((resolve, reject) => {
      dd.config(param);
      dd.ready(() => {
        resolve({
          status: status,
          data: {
            message: 'DingTalk jsApi concents  ok: ',
            param,
            success: true,
            code: 200
          }
        });
      });
      dd.error(err => {
        reject({
          status: status,
          data: {
            message: 'DingTalk jsApi concents : ' + JSON.stringify(err),
            success: false,
            code: DING_TALK_ERROR_STATUS.CONFIG
          }
        });
      });
    });
  }
  authLogin(corpId) {
    return new Promise((resolve, reject) => {
      dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        onSuccess: result => {
          resolve({
            status: status,
            data: {
              message: 'DingTalk requestAuthCode concents  ok: ',
              result,
              success: true,
              code: 200
            }
          });
        },
        onFail: err => {
          reject({
            status: status,
            data: {
              code: DING_TALK_ERROR_STATUS.AUTH_LOGIN,
              message: 'DingTalk requestAuthCode concents : ' + JSON.stringify(err),
              success: false
            }
          });
        }
      });
    });
  }
  getUserInfo(corpId) {
    return new Promise((resolve, reject) => {
      dd.biz.user.get({
        corpId: corpId,
        onSuccess: info => {
          resolve({
            status: status,
            data: {
              message: 'userGet success',
              info,
              success: true,
              code: 200
            }
          });
        },
        onFail: err => {
          reject({
            status: status,
            data: {
              message: `userGet fail${JSON.stringify(err)}`,
              success: true,
              code: DING_TALK_ERROR_STATUS.USER_INFO
            }
          });
        }
      });
    });
  }
  openLink(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject({
          status: status,
          data: {
            message: 'url does not exist',
            code: DING_TALK_ERROR_STATUS.OPEN_LINK
          }
        });
      }
      dd.biz.util.openLink({
        url: url,
        onFail: err => {
          reject({
            status: status,
            data: {
              message: 'open link failed',
              code: DING_TALK_ERROR_STATUS.OPEN_LINK
            }
          });
        }
      });
    });
  }
}

export default new DingClient();
