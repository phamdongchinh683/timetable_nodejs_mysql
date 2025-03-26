const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;
const verify = promisify(jwt.verify).bind(jwt);
async function verifyToken(token, secretKey) {
  try {
    return await verify(token, secretKey);
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Type Error occurred:", error.message);
    } else if (error instanceof ReferenceError) {
      console.error("Reference error occurred:", error.message);
    } else {
      console.error("Error in verifying access token:", error.message);
    }
    return null;
  }
}

module.exports = { verifyToken };
