module.exports = {
  allowQueryToken: true,
  accessTokenName: "accessToken",
  async validate(request, token, h) {
    const unknownTokenResp = {
      credentials: {},
      isValid: false
    };
    try {
      const client = request.redis.client;
      const result = await client.get("access_token:" + token);
      const isValid = result != null;
      if (!isValid) {
        return unknownTokenResp;
      }
      const resultObj = JSON.parse(result);
      const credentials = {
        userId: resultObj.userId,
        email: resultObj.email,
        address: resultObj.address,
        type: resultObj.type,
        token
      };
      // for test
      // const isValid = true;
      // const credentials = {
      //   userId: 1,
      //   email: null,
      //   address: null,
      //   type: 'password'
      // };
      return {
        isValid,
        credentials
      };
    } catch (err) {
      request.log("ERROR", err);
      return unknownTokenResp;
    }
  }
};
