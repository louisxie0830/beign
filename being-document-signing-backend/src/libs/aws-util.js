const AWS = require("aws-sdk");
const fs = require("fs");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
});
const bucketName = process.env.AWS_S3_BUCKET || "";
const client = new AWS.S3();

module.exports = {
  // need to await
  put: (key, file) => {
    const fileByte = fs.readFileSync(file);
    return client
      .upload({
        Bucket: bucketName,
        Body: fileByte,
        Key: key
      })
      .promise();
  },
  get: (key, file) => {
    return new Promise((resolve, reject) => {
      const stream = client
        .getObject({ Bucket: bucketName, Key: key })
        .createReadStream();
      const ws = fs.createWriteStream(file);
      stream.on("error", err => {
        reject(err);
      });
      stream.pipe(ws).on("error", err => {
        reject(err);
      }).on("close", () => {
        resolve();
      });
    });
  }
};
