const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;
const verify = promisify(jwt.verify).bind(jwt);
async function decodeToken(token, secretKey) {
  try {
    return await verify(token, secretKey, {
      ignoreExpiration: false,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Type Error occurred:", error.message);
    } else if (error instanceof ReferenceError) {
      console.error("Reference error occurred:", error.message);
    } else {
      console.error(`Error in decode access token: ${error}`);
    }
    return null;
  }
}

module.exports = { decodeToken };
