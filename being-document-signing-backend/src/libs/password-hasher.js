const Bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = {
  hash: async (plaintextPassword) => {

    return await Bcrypt.hash(plaintextPassword, saltRounds);
  },
  compare: async (plaintextPassword, hashedPassword) => {

    return await Bcrypt.compare(plaintextPassword, hashedPassword);
  }
};
