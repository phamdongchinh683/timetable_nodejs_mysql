const { responseStatus } = require("../../globals/handler");
const authService = require("../../services/Auth/auth.service");
const roleService = require("../../services/Teacher/role.service");
const teacherService = require("../../services/Teacher/teacher.service");
class TeacherController {
  async createAccounts(req, res) {
    try {
      await authService.insertManyUsers(req.users, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async createRoles(req, res) {
    const { roles } = req.body;
    try {
      await roleService.insertManyRoles(roles, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateRole(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    if (name === "") {
      return responseStatus(res, 400, "failed", "Not empty name role");
    }
    try {
      await roleService.updateOne(id, name, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteRole(req, res) {
    const id = req.params.id;
    if (id === "") {
      return responseStatus(res, 400, "failed", "Not empty parameter id");
    }
    try {
      await roleService.deleteOne(id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async roleList(req, res) {
    try {
      await roleService.findAllRoles(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      await teacherService.signIn(email, password, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }
}

module.exports = new TeacherController();
