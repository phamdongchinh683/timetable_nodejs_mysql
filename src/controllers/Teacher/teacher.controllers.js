const { responseStatus } = require("../../globals/handler");
const studentService = require("../../services/Student/student.service");
const classService = require("../../services/Teacher/class.service");
const roleService = require("../../services/Teacher/role.service");
const roomService = require("../../services/Teacher/room.service");
const subjectService = require("../../services/Teacher/subject.service");
const teacherService = require("../../services/Teacher/teacher.service");
const teacherSubjectService = require("../../services/Teacher/teacher.subject.service");
const timetableService = require("../../services/Teacher/timetable.service");
const userService = require("../../services/Teacher/user.serivce");
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
      await userService.insertManyUsers(req.users, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async accountList(req, res) {
    try {
      await userService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateAccount(req, res) {
    const id = req.params.id;
    try {
      await userService.updateUser(id, req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteAccounts(req, res) {
    const { ids } = req.body;

    try {
      await userService.deleteUser(ids, res);
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

  async getRoomsEmpty(req, res) {
    try {
      await roomService.findAllRoomEmptyByDayOfWeek(res);
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

  // subject

  async createSubjects(req, res) {
    try {
      await subjectService.insertMany(req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateSubject(req, res) {
    const id = req.params.id;

    try {
      await subjectService.updateOne(id, req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteSubjects(req, res) {
    const { ids } = req.body;
    if (ids.length === 0) {
      return responseStatus(res, 400, "failed", "Please not empty ids");
    }
    try {
      await subjectService.deleteMany(ids, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async subjectList(req, res) {
    try {
      await subjectService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  // create account teacher

  async createAccountTeacher(req, res) {
    try {
      await teacherService.insertMany(req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateAccountTeacher(req, res) {
    const id = req.params.id;

    try {
      await teacherService.updateOne(id, req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteAccountsTeacher(req, res) {
    const { ids } = req.body;
    if (ids.length === 0) {
      return responseStatus(res, 400, "failed", "Please not empty ids");
    }
    try {
      await teacherService.deleteMany(ids, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async AccountTeacherList(req, res) {
    try {
      await teacherService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  // create account student

  async createAccountStudent(req, res) {
    try {
      await studentService.insertMany(req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateAccountStudent(req, res) {
    const id = req.params.id;

    try {
      await studentService.updateOne(id, req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteAccountsStudent(req, res) {
    const { ids } = req.body;
    if (ids.length === 0) {
      return responseStatus(res, 400, "failed", "Please not empty ids");
    }
    try {
      await studentService.deleteMany(ids, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async AccountStudentList(req, res) {
    try {
      await studentService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async detailStudent(req, res) {
    const id = req.params.id;
    try {
      await studentService.findOneById(id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  // teacher subject

  async createSubjectForTeacher(req, res) {
    try {
      await teacherSubjectService.insertOne(req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateSubjectTeacher(req, res) {
    const id = req.params.id;

    try {
      await teacherSubjectService.updateOne(id, req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteSubjectTeacher(req, res) {
    const { ids } = req.body;
    if (ids.length === 0) {
      return responseStatus(res, 400, "failed", "Please not empty ids");
    }
    try {
      await teacherSubjectService.deleteMany(ids, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async SubjectTeacherList(req, res) {
    try {
      await teacherSubjectService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async detailTeacher(req, res) {
    const id = req.params.id;
    try {
      await teacherSubjectService.findByTeacherId(id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  // timetables

  async getAllTimetable(req, res) {
    try {
      await timetableService.findAll(res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async updateTimetable(req, res) {
    const id = req.params.id;
    try {
      await timetableService.updateOne(id, req.user.id, req.data, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async timetableByTeacherId(req, res) {
    const id = req.params.id;
    try {
      await timetableService.findByTeacherId(id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async deleteTimetables(req, res) {
    const { ids } = req.body;
    try {
      await timetableService.deleteMany(ids, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }
}

module.exports = new TeacherController();
