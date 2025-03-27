const { responseStatus } = require("../../globals/handler");
const authService = require("../../services/Auth/auth.service");
const classService = require("../../services/Teacher/class.service");
const roleService = require("../../services/Teacher/role.service");
const roomService = require("../../services/Teacher/room.service");
const teacherService = require("../../services/Teacher/teacher.service");
class TeacherController {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      await teacherService.signIn(email, password, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }
  async createAccounts(req, res) {
    try {
      await authService.insertManyUsers(req.users, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  // role
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
  // room

  async createRooms(req, res) {
    try {
      await roomService.insertMany(req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateRoom(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    if (name === "") {
      throw "Not empty name room";
    }
    try {
      await roomService.updateOne(id, name, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteRooms(req, res) {
    const { ids } = req.body;
    if (ids.length === 0) {
      throw "Please not empty ids";
    }
    try {
      await roomService.deleteMany(ids, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async roomList(req, res) {
    try {
      await roomService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }
  // class

  async createClasses(req, res) {
    try {
      await classService.insertMany(req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateClass(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    if (name === "") {
      return responseStatus(res, 400, "failed", "Not empty name class");
    }
    try {
      await classService.updateOne(id, name, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteClasses(req, res) {
    const { ids } = req.body;
    if (ids.length === 0) {
      return responseStatus(res, 400, "failed", "Please not empty ids");
    }
    try {
      await classService.deleteMany(ids, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async classList(req, res) {
    try {
      await classService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }
}

module.exports = new TeacherController();
