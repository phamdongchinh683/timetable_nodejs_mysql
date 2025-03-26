const { responseStatus } = require("../globals/handler");
const { _tokenSecret } = require("../globals/secretKey");
const { verifyToken } = require("../utils/verifyToken");

class AuthMiddleware {
  async authorization(req, res, next) {
    const authorizationToken = req.headers["token"];
    if (!authorizationToken) {
      return responseStatus(res, 401, "failed", "Invalid authorization!");
    }
    try {
      const verified = await verifyToken(authorizationToken, _tokenSecret);
      if (!verified) {
        return responseStatus(res, 403, "failed", "You do not have access!");
      }
      const payload = {
        email: verified.payload.email,
        id: verified.payload.id,
        role: verified.payload.role,
      };
      req.user = payload;
      next();
    } catch (error) {
      return responseStatus(
        res,
        403,
        "failed",
        "Failed to authenticate token."
      );
    }
  }
}

module.exports = new AuthMiddleware();
