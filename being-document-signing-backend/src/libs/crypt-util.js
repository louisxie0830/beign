const Fs = require("fs");
const Crypto = require("crypto");
const encryptKey = require('./encryptKey')
// const key = Crypto.scryptSync("beingsign.com", "salt", 32);
// const iv = Buffer.alloc(16, 0);
const iv = Buffer.from("https://beingsign.com/", "binary")
  .toString("hex")
  .slice(0, 16);

module.exports = {
  async encryptFile(source, dist, version) {
    const key = Buffer.from(encryptKey[version], "binary")
      .toString("hex")
      .slice(0, 32);
    const cipher = Crypto.createCipheriv("aes-256-cbc", key, iv).setAutoPadding(
      true
    );
    const input = Fs.createReadStream(source);
    const output = Fs.createWriteStream(dist);
    return new Promise((resolve, reject) => {
      input
        .on("error", e => {
          reject(e);
        })
        .pipe(cipher)
        .on("error", e => {
          reject(e);
        })
        .pipe(output)
        .on("error", e => {
          reject(e);
        });
      output.on("error", e => {
        reject(e);
      });
      output.on("finish", function () {
        resolve();
      });
    });
  },
  async decryptFile(source, dist, version) {
    const key = Buffer.from(encryptKey[version], "binary")
      .toString("hex")
      .slice(0, 32);
    const decipher = Crypto.createDecipheriv(
      "aes-256-cbc",
      key,
      iv
    ).setAutoPadding(true);
    const input = Fs.createReadStream(source);
    const output = Fs.createWriteStream(dist);
    return new Promise((resolve, reject) => {
      input
        .on("error", e => {
          reject(e);
        })
        .pipe(decipher)
        .on("error", e => {
          reject(e);
        })
        .pipe(output)
        .on("error", e => {
          reject(e);
        });
      output.on("error", e => {
        reject(e);
      });
      output.on("finish", function () {
        resolve();
      });
    });
  }
};
