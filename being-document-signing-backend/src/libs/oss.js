const OSS = require("ali-oss");
const client = new OSS({
  region: process.env.ALI_OSS_REGION || "oss-cn-beijing",
  // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: process.env.ALI_OSS_KEYID || "LTAItF5tKkx4q4RI",
  accessKeySecret:
    process.env.ALI_OSS_KEYSECRET || "gkD40ahKOVcVJQB2lZBctVREi3XtBP"
});
client.useBucket(process.env.ALI_OSS_BUCKET || "bingsign-test");

module.exports = {
  // need to await
  put: async (key, file) => {
    return client.put(key, file, {
      timeout: 1800000
    });
  },
  getUrl: async (key, filename) => {
    let url = client.signatureUrl(key, {
      expires: 900,
      response: {
        "content-disposition": `attachment; filename=${filename}`
      }
    });
    console.log(url);
    return url;
  },
  get: async (key, file) => {
    try {
      let result = await client.get(key, file);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  list: async () => {
    try {
      // 不带任何参数，默认最多返回1000个文件
      // const result = await client.list();
      // return result;
      // 根据nextMarker继续列出文件
      // if (result.isTruncated) {
      //   const result1 = await client.list({
      //     marker: result.nextMarker
      //   });
      //   console.log(result1)
      // }
      // 列出前缀为'my-'的文件
      const result = await client.list({
        prefix: '2019/6/24'
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }
};
