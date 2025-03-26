const { responseStatus } = require("../../globals/handler");
const authService = require("../../services/Auth/auth.service");
const teacherService = require("../../services/Teacher/teacher.service");
class TeacherController {
  async createAccounts(req, res) {
    const { users } = req.body;
    try {
      await authService.insertManyUsers(users, res);
    } catch (e) {
      console.log(e);
      return responseStatus(res, 400, "failed", e);
    }
  }

  async createRoles(req, res) {
    const { roles } = req.body;
    try {
      await authService.insertManyRoles(roles, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }

  async login(req, res) {
    const { email, password } = req.values;
    try {
      await teacherService.signIn(email, password, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }
}

module.exports = new TeacherController();
