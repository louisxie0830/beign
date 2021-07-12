const Leader = require("redis-leader");
const RedLock = require("redlock");
const { web3, contractInstance } = require("./web3-client");
const instances = require("hapi-sequelizejs").instances;
const { Op } = require("sequelize");
async function handle(redLock) {
  const SignatureModel = instances.getModel("signature");
  const BlockchainErrorLogsModel = instances.getModel("blockchainErrorLogs");
  const Sequelize = instances.getDb().sequelize;
  const resource = "locks:block-chain-handler";

  // the maximum amount of time you want the resource locked in milliseconds,
  // keeping in mind that you can extend the lock up until
  // the point when it expires
  const ttl = 10000;
  const lock = await redLock.lock(resource, ttl);
  try {
    const signatures = await SignatureModel.findAll({
      where: {
        [Op.or]: [{ tx: null }, { tx: "" }]
      },
      order: [
        ["send", "ASC"],
        ["createTime", "DESC"]
      ],
      limit: 10
    });
    if (signatures.length <= 0) {
      return;
    }
    // console.log("trying renew nonce");
    let nonce = await web3.eth.getTransactionCount(
      web3.eth.defaultAccount,
      "pending"
    );
    // console.log("nonce==>", nonce);
    for (let i = 0; i < signatures.length; ++i) {
      const s = signatures[i];
      const contractParams = {
        uuid: s.uuid,
        signature: s.signature,
        signer_id: s.signerId + "",
        signer_address: s.signerAddress
      };
      const tx = {
        from: web3.eth.defaultAccount,
        gasPrice: 0,
        gas: 12000000,
        nonce: nonce++
      };
      const transactionObject = contractInstance.methods.createSignature(
        s.uuid,
        s.signature,
        s.signerId + "",
        s.signerAddress
      );
      await Sequelize.transaction(async transaction => {
        try {
          const result = await new Promise((resolve, reject) => {
            transactionObject
              .send(tx)
              .once("receipt", function(receipt) {
                resolve({ success: true, receipt, tx, s, contractParams });
              })
              .on("confirmation", function(confNumber, receipt) {})
              .on("error", function(error) {
                resolve({ success: false, error, tx, s, contractParams });
              });
          });
          if (result) {
            let { success, receipt, error, tx, s, contractParams } = result;
            if (success) {
              await SignatureModel.update(
                {
                  send: 1,
                  status: 1,
                  tx: receipt.transactionHash
                },
                { where: { id: s.id }, transaction }
              );
            } else {
              await SignatureModel.update(
                {
                  send: 1,
                  status: -1
                },
                { where: { id: s.id }, transaction }
              );
              await BlockchainErrorLogsModel.create(
                {
                  transactionObject: JSON.stringify(tx),
                  contractParams: JSON.stringify(contractParams),
                  code: error.code || "",
                  message: error.message || "",
                  stack: error.stack || "",
                  createdAt: new Date()
                },
                { transaction }
              );
            }
          }
        } catch (error) {
          await SignatureModel.update(
            { send: -1 },
            { where: { id: s.id }, transaction }
          );
          await BlockchainErrorLogsModel.create(
            {
              transactionObject: JSON.stringify(tx),
              contractParams: JSON.stringify(contractParams),
              code: error.code || "",
              message: error.message || "",
              stack: error.stack || "",
              createdAt: new Date()
            },
            { transaction }
          );
        }
      });
    }
  } catch (err) {
    console.error("handler ERROR", err);
  } finally {
    await lock.unlock();
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = redis => {
  const redLock = new RedLock(
    // you should have one client for each independent redis node
    // or cluster
    [redis],
    {
      // the expected clock drift; for more details
      // see http://redis.io/topics/distlock
      driftFactor: 0.01, // time in ms

      // the max number of times Redlock will attempt
      // to lock a resource before erroring
      retryCount: 10,

      // the time in ms between attempts
      retryDelay: 200, // time in ms

      // the max time in ms randomly added to retries
      // to improve performance under high contention
      // see https://www.awsarchitectureblog.com/2015/03/backoff.html
      retryJitter: 200 // time in ms
    }
  );
  const leader = new Leader(redis);
  leader.on("elected", async () => {
    try {
      await Promise.all([handle(redLock), timeout(1000)]);
    } catch (e) {
      console.log(e);
    }
    leader.stop();
  });
  leader.on("revoked", () => {
    // console.log("not leader", Process.pid);
    leader.elect();
  });
  leader.on("error", err => {
    console.log("redis-leader", err);
  });
  leader.elect();
};
