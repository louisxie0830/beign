const cityZhTw = require('./city.zh-tw.json');
const cityZhCn = require('./city.zh-cn.json');
const regionZhTw = require('./region.zh-tw.json');
const regionZhCn = require('./region.zh-cn.json');

export const getRegion = lang => {
  return lang === 'zh-tw' ? regionZhTw : regionZhCn;
};

export const getCity = lang => {
  return lang === 'zh-tw' ? cityZhTw : cityZhCn;
};
