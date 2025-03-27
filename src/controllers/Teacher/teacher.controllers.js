const { responseStatus } = require("../../globals/handler");
const authService = require("../../services/Auth/auth.service");
const roleService = require("../../services/Teacher/role.service");
const teacherService = require("../../services/Teacher/teacher.service");
class TeacherController {
  async createAccounts(req, res) {
    try {
      await authService.insertManyUsers(req.users, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }

  async createRoles(req, res) {
    const { roles } = req.body;
    try {
      await roleService.insertManyRoles(roles, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }

  async updateRole(req, res) {
    const { id } = req.param.id;
    const { name } = req.body;
    try {
      await roleService.updateOne(id, name, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }

  async deleteRole(req, res) {
    const { id } = req.param.id;
    try {
      await roleService.deleteOne(id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }

  async roleList(req, res) {
    try {
      await roleService.findAllRoles(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      await teacherService.signIn(email, password, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }
}

module.exports = new TeacherController();
