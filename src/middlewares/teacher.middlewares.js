const { responseStatus } = require("../../globals/handler");
const { verifyToken } = require("../../utils/verifyToken");
const { _tokenSecret } = require("../../globals/secretKey");

class TeacherMiddleware {
  async isTeacher(req, res, next) {}
}

module.exports = new TeacherMiddleware();
