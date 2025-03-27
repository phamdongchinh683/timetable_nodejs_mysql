const { responseStatus } = require("../../globals/handler");
const authService = require("../Auth/auth.service");

class TeacherService {
  async signIn(email, password, res) {
    return await authService.generateAccessToken(email, password, res);
  }

  async myInfo(id, res) {
    let user = await authService.findOneUserById(id);

    if (!user) {
      return null;
    }
    return responseStatus(res, 200, "success", user);
  }

  
}

module.exports = new TeacherService();
