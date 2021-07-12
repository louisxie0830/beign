const Uuid4 = require("uuid/v4");
const Boom = require("@hapi/boom");
module.exports = async (
  conn,
  {
    target_type,
    target_id,
    signer_id,
    message,
    signer_address,
    signature,
    payload,
    signer_company_id
  }
) => {
  const insertSignatureSql =
    "insert into signature (uuid, target_type, target_id, signer_id, signer_address, message, signature, payload, tx, create_time, signer_company_id, send, status) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)";
  let tx = null;
  const uuid = Uuid4();
  const [signatureRow] = await conn.execute(insertSignatureSql, [
    uuid,
    target_type,
    target_id,
    signer_id,
    signer_address,
    message,
    signature,
    payload,
    tx,
    new Date(),
    signer_company_id
  ]);
  const signatureId = signatureRow.insertId;
  if (!signatureId) {
    throw Boom.internal("create_signature_row_error");
  }
  return signatureId;
};
