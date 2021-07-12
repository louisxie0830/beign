const text2png = require("text2png");
const sizeOf = require("image-size");
const Fs = require("fs");
module.exports = {
  base64ToFile: (file, base64Data) => {
    const data = base64Data.replace("data:image/png;base64,", "");
    return new Promise((resolve, reject) => {
      Fs.writeFile(file, data, "base64", function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  textToPng: (text, color = "#EA0606") => {
    const buffer = text2png(text, {
      color: color,
      borderWidth: 0,
      padding: 5,
      lineSpacing: 5,
      font: "14px WenQuanYi Zen Hei"
    });
    const image = sizeOf(buffer);
    image.buffer = buffer;
    return image;
  }
};
