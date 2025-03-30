const { responseStatus } = require("../globals/handler");
const authService = require("../services/Auth/auth.service");
const roleService = require("../services/Teacher/role.service");

class StudentMiddleware {
  async studentRole(req, res, next) {
    try {
      const role = await roleService.findRoleById(req.user.role);
      if (role === "Not found role" || role !== "student") {
        return responseStatus(res, 400, "failed", "Only student can access!");
      }
      next();
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }
  

  async isStudent(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return responseStatus(res, 403, "failed", "Only student can log in!");
      }
      const role = await roleService.findRoleById(user.role_id);
      if (role === "Not found role" || role !== "student") {
        return responseStatus(res, 403, "failed", "Only student can log in!");
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

module.exports = new StudentMiddleware();
