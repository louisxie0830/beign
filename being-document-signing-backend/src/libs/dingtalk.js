const Axios = require('axios');
const CORP_ID = process.env.CORP_ID;
const SUITE_KEY = process.env.SUITE_KEY;
const SUITE_SECRET = process.env.SUITE_SECRET;
const SUITE_ID = process.env.SUITE_ID;
const APP_ID = process.env.APP_ID;
const DING_HOST = process.env.DING_HOST;
module.exports = function (opts) {

  opts = opts || {};
  const redis = opts.redis;
  const mysql = opts.mysql;
  async function getSuiteAccessToken() {

    try {
      let suite_access_token = null;
      const key = 'suite_access_token-' + SUITE_KEY;
      suite_access_token = await redis.get(key);
      console.log('suite_access_token:redis', suite_access_token);
      if (suite_access_token) {
        suite_access_token = JSON.parse(suite_access_token);
        if (suite_access_token &&
          suite_access_token.expires_in &&
          suite_access_token.suite_access_token &&
          suite_access_token.expires_time - Date.now() > 600000) {
          return suite_access_token.suite_access_token;
        }
      }
      const querySuiteTicketSql = 'select * from open_sync_biz_data where corp_id = ? and biz_id = ? and biz_type = 2 order by gmt_create desc limit 1';
      const [suite_ticket] = await mysql.query(querySuiteTicketSql, [CORP_ID, SUITE_ID]);
      if (suite_ticket && suite_ticket[0]) {
        const suite_ticket_obj = suite_ticket[0];
        const biz_data = suite_ticket_obj.biz_data;
        if (biz_data) {
          const biz_data_json = JSON.parse(biz_data);
          if (biz_data_json && biz_data_json.syncAction === "suite_ticket") {
            const suite_ticket_str = biz_data_json.suiteTicket;
            const url = `${DING_HOST}/service/get_suite_token`;
            try {
              /*
              api response sample:
              {
                  "suite_access_token":"61W3mEpU66027wgNZ_MhGHNQDHnFATkDa9-2llqrMBjUwxRSNPbVsMmyD-yq8wZETSoE5NQgecigDrSHkPtIYA",
                  "expires_in":7200
              }
              */
              const resp = await Axios.post(url, {
                suite_key: SUITE_KEY,
                suite_secret: SUITE_SECRET,
                suite_ticket: suite_ticket_str
              }, {
                timeout: 3000

              });
              console.log('suite_access_token_resp', resp.data);
              if (resp.status === 200) {
                suite_access_token = resp.data;
              }
            } catch (e) {
              console.error(e.data);
              return null;
            }
          }
        }
      }
      if (suite_access_token &&
        suite_access_token.expires_in &&
        suite_access_token.suite_access_token) {
        const expires_in = suite_access_token.expires_in;
        suite_access_token.expires_time = Date.now() + expires_in * 1000;
        await redis.set(key, JSON.stringify(suite_access_token));
        return suite_access_token.suite_access_token;
      }
    } catch (e) {
      console.error(e)
    }
    return null;
  }
  async function getCorpAccessToken(auth_corpid) {

    let corp_access_token = null;
    const key = 'corp_access_token-' + auth_corpid;
    corp_access_token = await redis.get(key);
    console.log('corp_access_token:redis', corp_access_token);
    if (corp_access_token) {
      corp_access_token = JSON.parse(corp_access_token);
      if (corp_access_token &&
        corp_access_token.expires_in &&
        corp_access_token.access_token &&
        corp_access_token.expires_time - Date.now() > 600000) {
        return corp_access_token.access_token;
      }
    }
    const suite_access_token = await getSuiteAccessToken();
    if (!suite_access_token) {
      return null;
    }
    const queryPermanentCodeSql = "select * from open_sync_biz_data where corp_id = ? and biz_id = ? and biz_type = 4 order by gmt_create desc limit 1 ";
    const [corpAuthRow] = await mysql.query(queryPermanentCodeSql, [auth_corpid, SUITE_ID]);
    let permanent_code = null;
    if (corpAuthRow && corpAuthRow[0] && corpAuthRow[0].biz_data) {
      const biz_data = JSON.parse(corpAuthRow[0].biz_data);
      if (biz_data && biz_data.permanent_code) {
        permanent_code = biz_data.permanent_code;
      }
    }
    if (!permanent_code) {
      return null;
    }
    const url = `${DING_HOST}/service/get_corp_token?suite_access_token=${suite_access_token}`;
    try {
      /*
      api response sample:
      {
          "access_token":"61W3mEpU66027wgNZ_MhGHNQDHnFATkDa9-2llqrMBjUwxRSNPbVsMmyD-yq8wZETSoE5NQgecigDrSHkPtIYA",
          "expires_in":7200
      }
      */
      const resp = await Axios.post(url, {
        auth_corpid,
        permanent_code
      }, {
        timeout: 3000
      });
      console.log('corp_access_token_resp', resp.data);
      if (resp.status === 200) {
        corp_access_token = resp.data;
      }
      if (corp_access_token &&
        corp_access_token.expires_in &&
        corp_access_token.access_token) {
        const expires_in = corp_access_token.expires_in;
        corp_access_token.expires_time = Date.now() + expires_in * 1000;
        await redis.set(key, JSON.stringify(corp_access_token));
        return corp_access_token.access_token;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  return {
    getAllCorpInfo: async () => {

      try {
        const queryCorpAuthSql = "select * from open_sync_biz_data where biz_id = ? and biz_type = 4 order by gmt_create desc";
        const [corpAuthRow] = await mysql.query(queryCorpAuthSql, [SUITE_ID]);
        if (corpAuthRow && corpAuthRow.length > 0) {
          const allCorpInfo = corpAuthRow.map(i => {

            const biz_data = JSON.parse(i.biz_data);
            if (biz_data && biz_data.auth_corp_info) {
              return biz_data.auth_corp_info;
            } else {
              return null;
            }
          }).filter(i => i !== null);
          return allCorpInfo;
        }
      } catch (e) {
        console.error(e)
      }
      return null;
    },
    getCorpInfo: async (auth_corpid) => {

      try {
        const queryCorpAuthSql = "select * from open_sync_biz_data where corp_id = ? and biz_id = ? and biz_type = 4 order by gmt_create desc limit 1 ";
        const [corpAuthRow] = await mysql.query(queryCorpAuthSql, [auth_corpid, SUITE_ID]);
        if (corpAuthRow && corpAuthRow[0] && corpAuthRow[0].biz_data) {
          const biz_data = JSON.parse(corpAuthRow[0].biz_data);
          if (biz_data && biz_data.auth_corp_info) {
            return biz_data.auth_corp_info;
          }
        }
      } catch (e) {
        console.error(e)
      }
      return null;
    },
    getCorpAgentId: async (auth_corpid) => {

      try {
        const queryCorpAuthSql = "select * from open_sync_biz_data where corp_id = ? and biz_id = ? and biz_type = 4 order by gmt_create desc limit 1 ";
        const [corpAuthRow] = await mysql.query(queryCorpAuthSql, [auth_corpid, SUITE_ID]);
        if (corpAuthRow && corpAuthRow[0] && corpAuthRow[0].biz_data) {

          const biz_data = JSON.parse(corpAuthRow[0].biz_data);
          if (biz_data && biz_data.auth_info && biz_data.auth_info.agent) {
            const auth_info = biz_data.auth_info;
            const agent = auth_info.agent;
            const agentId = agent.filter(i => i.appid == APP_ID);
            if (agentId && agentId[0]) {
              return agentId[0].agentid;
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
      return null;
    },

    activeSuite: async (auth_corpid) => {

      const suite_access_token = await getSuiteAccessToken();
      if (!suite_access_token) {
        return null;
      }
      const url = `${DING_HOST}/service/activate_suite?suite_access_token=${suite_access_token}`
      try {
        /*
        api response sample:
        {
          "errcode":0,
          "errmsg":"ok"
        }
        */
        return await Axios.post(url, {
          suite_key: SUITE_KEY,
          auth_corpid: auth_corpid
        }, {
          timeout: 3000,
        });
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    getJsTicket: async (auth_corpid) => {

      try {
        let js_ticket = null;
        const key = 'corp_js_ticket-' + auth_corpid;
        js_ticket = await redis.get(key);
        console.log('corp_js_ticket:redis', js_ticket);
        if (js_ticket) {
          js_ticket = JSON.parse(js_ticket);
          if (js_ticket &&
            js_ticket.expires_in &&
            js_ticket.ticket &&
            js_ticket.expires_time &&
            js_ticket.expires_time - Date.now() > 600000) {
            return js_ticket.ticket;
          }
        }
        const access_token = await getCorpAccessToken(auth_corpid);
        if (!access_token) {
          return null;
        }
        const url = `${DING_HOST}/get_jsapi_ticket?access_token=${access_token}`;
        try {
          /*
        api response sample:
{
    "errcode": 0,
    "errmsg": "ok",
    "ticket": "dsf8sdf87sd7f87sd8v8ds0vs09dvu09sd8vy87dsv87",
    "expires_in": 7200
}
        */
          const resp = await Axios.get(url, {
            timeout: 3000
          });
          console.log('get_jsapi_ticket_resp', resp.data);
          if (resp.status === 200) {
            js_ticket = resp.data;
          }
        } catch (e) {
          console.error(e.data);
          return null;
        }
        if (js_ticket &&
          js_ticket.expires_in &&
          js_ticket.ticket) {
          const expires_in = js_ticket.expires_in;
          js_ticket.expires_time = Date.now() + expires_in * 1000;
          await redis.set(key, JSON.stringify(js_ticket));
          return js_ticket.ticket;

        }
      } catch (e) {
        console.error(e);
      }
      return null;
    },
    getUserDetail: async (auth_corpid, userid) => {

      const access_token = await getCorpAccessToken(auth_corpid);
      if (!access_token) {
        return null;
      }
      const url = `${DING_HOST}/user/get?access_token=${access_token}&userid=${userid}`;
      try {
        /*
        ！！！！需要通讯录权限！！！！
        api response sample:
  {
      "errcode": 0,
      "unionid": "PiiiPyQqBNBii0HnCJ3zljcuAiEiE",
      "openId": "PiiiPyQqBNBii0HnCJ3zljcuAiEiE",
      "roles": [{
          "id": 23003585,
          "name": "财务",
          "groupName": "职务"
      }],
      "remark": "备注",
      "userid": "04232334556237185",
      "isLeaderInDepts": "{1:false}",
      "isBoss": false,
      "hiredDate": 1520265600000,
      "isSenior": false,
      "tel": "010-88996533",
      "department": [1,2],
      "workPlace": "北京市朝阳区",
      "email": "ceshi@aliyun.com",
      "orderInDepts": "{1:71738366882504}",
      "mobile": "15901516821",
      "errmsg": "ok",
      "active": false,
      "avatar": "dingtalk.com/abc.jpg",
      "isAdmin": false,
      "isHide": false,
      "jobnumber": "001",
      "name": "测试名字",
      "extattr": {},
      "stateCode": "86",
      "position": "总监"
  }
        */
        return await Axios.get(url, {
          timeout: 3000
        });
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    getUserInfo: async (auth_corpid, code) => {

      const access_token = await getCorpAccessToken(auth_corpid);
      if (!access_token) {
        return null;
      }
      const url = `${DING_HOST}/user/getuserinfo?access_token=${access_token}&code=${code}`;
      try {
        /*
        api response sample:
  {
      "errcode": 0,
      "errmsg": "ok",
      "userid": "USERID",
      "deviceId":"DEVICEID",
      "is_sys": true, //是否是管理员
      "sys_level": 0|1|2 //级别，0：非管理员 1：超级管理员（主管理员） 2：普通管理员（子管理员） 100：老板
  }
        */
        const resp = await Axios.get(url, {
          timeout: 3000
        });
        if (resp.status === 200) {
          return resp.data;
        }
      } catch (e) {
        console.error(e);
      }
      return null;
    },
    getCorpAuthInfo: async (auth_corpid) => {

      const suite_access_token = await getSuiteAccessToken();
      if (!suite_access_token) {
        return null;
      }
      const url = `${DING_HOST}/service/get_auth_info?suite_access_token=${suite_access_token}`
      try {
        /*
        api response sample:
  {
     "auth_corp_info":{
        "corp_logo_url":"http://xxxx.png",
        "corp_name":"corpid",
        "corpid":"auth_corpid_value",
        "industry":"互联网",
        "invite_code" : "1001",
        "license_code": "xxxxx",
        "auth_channel": "xxxxx",
        "auth_channel_type": "xxxxx",
        "is_authenticated":false,
        "auth_level":0,
        "invite_url":"https://yfm.dingtalk.com/invite/index?code=xxxx"
      },
      "auth_user_info":
      {
          "userId":""
      },
      "auth_info":{
      "agent":[{
              "agent_name":"aaaa",
              "agentid":1,
              "appid":-3,
              "logo_url":"http://aaaaaa.com",
              "admin_list":["zhangsan","lisi"]
      }
      ,{
              "agent_name":"bbbb",
              "agentid":4,
              "appid":-2,
              "logo_url":"http://vvvvvv.com",
              "admin_list":[]
      }]
      },
          "channel_auth_info": {
          "channelAgent": [
                  {
                      "agent_name": "应用1",
                      "agentid": 36,
                      "appid": 6,
                      "logo_url": "http://i01.lw.test.aliimg.com/media/lALOAFWTc8zIzMg_200_200.png"
                  },
                  {
                      "agent_name": "应用2",
                      "agentid": 35,
                      "appid": 7,
                      "logo_url": "http://i01.lw.test.aliimg.com/media/lALOAFWTc8zIzMg_200_200.png"
                  }
                      ]
          },
       "errcode":0,
      "errmsg":"ok"
  }
        */
        return await Axios.post(url, {
          auth_corpid,
          suite_key: SUITE_KEY
        }, {
          timeout: 3000
        });
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };
}
