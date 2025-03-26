const { responseStatus } = require("../globals/handler");
const authService = require("../services/Auth/auth.service");

class StudentMiddleware {
  async studentRole(req, res, next) {
    try {
      const role = await authService.findRoleById(req.user.role);
      if (role === "Not found role" || role !== "student") {
        return responseStatus(res, 400, "failed", "This user not found role");
      }
      next();
    } catch (error) {
      return responseStatus(res, 400, "failed", error);
    }
  }

  async isStudent(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return responseStatus(
          res,
          402,
          "failed",
          "Username you entered isn't connected to an account."
        );
      }
      console.log(user);
      const role = await authService.findRoleById(user.role_id);
      if (role === "Not found role" || role !== "student") {
        return responseStatus(res, 401, "failed", "Only student can log in!");
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

module.exports = new StudentMiddleware();
