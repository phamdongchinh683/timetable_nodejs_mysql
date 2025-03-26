const { responseStatus } = require("../../globals/handler");
const studentService = require("../../services/Student/student.service");

class StudentController {
  async login(req, res) {
    const { email, password } = req.values;
    try {
      await studentService.signIn(email, password, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }

  async profile(req, res) {
    try {
      await studentService.myInfo(req.user.id, res);
    } catch (e) {
      return responseStatus(res, 400, "failed", e);
    }
  }
}
module.exports = new StudentController();
