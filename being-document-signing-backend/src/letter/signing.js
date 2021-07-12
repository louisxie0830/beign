const PdfUtil = require("../libs/pdf-util");
const Crypto = require("crypto");
const Fs = require("fs");
const Uuid = require("uuid/v4");
const signing = {
  currentVersion: "1.0.0",
  createFile: async (
    inputFile,
    connection,
    currentUserId,
    ip,
    userAgent,
    signingStatus
  ) => {
    const uuid = Uuid();
    const version = signing.currentVersion;
    await PdfUtil.setMetadata(inputFile, {
      BeingSigningVersion: version,
      BeingSigningId: uuid
    });
    const fileBuffer = Fs.readFileSync(inputFile);
    const insertSigningFile =
      "INSERT INTO `file_verify` (`uuid`, `user_id`, `file_hash`, `create_time`, `ip`, `user_agent`,signing_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    if (version === "1.0.0") {
      const hash = Crypto.createHash("sha256")
        .update(fileBuffer)
        .digest()
        .toString("hex");
      await connection.query(insertSigningFile, [
        uuid,
        currentUserId,
        hash,
        new Date(),
        ip || "",
        userAgent || "",
        signingStatus || 0
      ]);
      return { uuid, hash };
    }
    await connection.query(insertSigningFile, [
      uuid,
      currentUserId,
      uuid,
      new Date(),
      ip || "",
      userAgent || ""
    ]);
    return { uuid, hash: uuid };
  },
  verifyFile: async (inputFile, connection) => {
    try {
      const metadata = await PdfUtil.getMetadata(inputFile, [
        "BeingSigningVersion",
        "BeingSigningId"
      ]);
      if (
        !metadata ||
        !metadata.BeingSigningVersion ||
        !metadata.BeingSigningId
      ) {
        console.log("metadata_error", inputFile);
        return { code: 91900 };
      }
      const querySigningFile =
        "select * from file_verify where uuid = ? limit 1";
      const [files] = await connection.query(querySigningFile, [
        metadata.BeingSigningId
      ]);

      const file = files[0];
      if (!file) {
        console.log("file_verify", inputFile);
        return { code: 91901 };
      }
      if (metadata.BeingSigningVersion === "1.0.0") {
        const fileBuffer = Fs.readFileSync(inputFile);
        const hash = Crypto.createHash("sha256")
          .update(fileBuffer)
          .digest()
          .toString("hex");
        console.log("verify", file);
        console.log("upload_hash", hash);
        console.log("verify_hash", file.file_hash);
        if (file.file_hash !== hash) {
          return { code: 91902 };
        }
      } else {
        return { code: 91903 };
      }
      return { code: 200, signingStatus: file.signing_status };
    } catch (e) {
      console.log("verify exception", e);
      return { code: 91903 };
    }
  }
};
module.exports = signing;
