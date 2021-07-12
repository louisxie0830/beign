const Handlebars = require("handlebars");
const Fs = require("fs");
const path = require("path");

// this will be called after the file is read
function renderToString(source, data) {
  var template = Handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}

function orderTemplate({
  api,
  xid,
  status,
  orderNo,
  currency,
  nonce,
  amount,
  timestamp,
  checkCode
}) {
  // console.log({ imgUrl });
  const htmlPath = path.join(__dirname, `./order.html`);
  const source = Fs.readFileSync(htmlPath, "utf8");
  return renderToString(source, {
    api,
    xid,
    status,
    orderNo,
    currency,
    nonce,
    amount,
    timestamp,
    checkCode
  });
}

module.exports = orderTemplate;
