require("dotenv").config();
const AsyncBlockChainHandler = require("./libs/async-blockchain-handler");
const Init = require("./server");

process.on("unhandledRejection", err => {
  console.log("unhandledRejection", err);
});

(async () => {
  const server = await Init();
  await server.start();
  AsyncBlockChainHandler(server.redis.client);
  server.log("Init", `Server running at: ${server.info.uri}`);
})();
