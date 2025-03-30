const { responseStatus } = require("../../globals/handler");
const studentService = require("../../services/Student/student.service");
const notificationService = require("../../services/Teacher/notification.service");
const timetableService = require("../../services/Teacher/timetable.service");

class StudentController {
  async login(req, res) {
    const { email, password } = req.values;
    try {
      await studentService.signIn(email, password, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async profile(req, res) {
    try {
      await studentService.myInfo(req.user.id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async getNotificationByClassId(req, res) {
    try {
      await notificationService.getNotificationByClassId(req.user.id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }

  async geTimetable(req, res) {
    try {
      await timetableService.findByClassId(req.user.id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e.message);
    }
  }
}
module.exports = new StudentController();
