const { responseStatus } = require("../globals/handler");
const authService = require("../services/Auth/auth.service");
const roleService = require("../services/Teacher/role.service");

class TeacherMiddleware {
  async teacherRole(req, res, next) {
    try {
      const role = await roleService.findRoleById(req.user.role);
      if (
        role === "Not found role" ||
        (role !== "teacher" && role !== "admin")
      ) {
        return responseStatus(
          res,
          400,
          "failed",
          "Only teacher or admin can access!"
        );
      }
      next();
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async isTeacher(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return responseStatus(
          res,
          403,
          "failed",
          "Only teacher can log in!" // i don't want use know this account exit in database but role difference
        );
      }
      const role = await roleService.findRoleById(user.role_id);
      if (
        role === "Not found role" ||
        (role !== "teacher" && role !== "admin")
      ) {
        return responseStatus(
          res,
          401,
          "failed",
          "Only teacher or admin can log in!"
        );
      }
      req.values = {
        email: email,
        password: password,
      };

      next();
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }
}

module.exports = new TeacherMiddleware();
