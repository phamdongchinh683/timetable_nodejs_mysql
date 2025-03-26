const { responseStatus } = require("../../globals/handler");
const { verifyToken } = require("../../utils/verifyToken");
const { _tokenSecret } = require("../../globals/secretKey");

class TeacherMiddleware {
  async teacherRole(req, res, next) {
    try {
      const role = await authService.findRoleById(req.user.role);
      if (role === "Not found role" || role !== "teacher") {
        return responseStatus(res, 400, "failed", "This user not found role");
      }
      next();
    } catch (error) {
      return responseStatus(res, 400, "failed", error);
    }
  }

  async isTeacher(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return responseStatus(
          res,
          402,
          "failed",
          "Only teacher can log in!" // i don't want use know this account exit in database but role difference
        );
      }
      const role = await authService.findRoleById(user.role_id);
      if (role === "Not found role" || role !== "teacher") {
        return responseStatus(res, 401, "failed", "Only teacher can log in!");
      }
      req.values = {
        email: email,
        password: password,
      };

      next();
    } catch (error) {
      return responseStatus(res, 400, "failed", error);
    }
  }
}

module.exports = new TeacherMiddleware();
