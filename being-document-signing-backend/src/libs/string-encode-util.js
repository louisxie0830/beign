const iconv = require("iconv-lite");

module.exports = function (str) {
    var result = "";
    var buf = iconv.encode(str, "big5");
    for (var i = 0; i < buf.length; i ++) {
        result += "%" + buf[i].toString(16).toUpperCase();
        // result +=
        //     (buf[i + 1] >= 65 && buf[i + 1] <= 90) ||
        //         (buf[i + 1] >= 97 && buf[i + 1] <= 122)
        //         ? String.fromCharCode(buf[i + 1])
        //         : "%" + buf[i + 1].toString(16).toUpperCase();
    }
    return result;
};
