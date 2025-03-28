const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { _tokenSecret, _tokenLife } = require("../../globals/secretKey");
const { comparePassword } = require("../../utils/hashHelper");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../../utils/tokenGenerator");

class AuthService {
  // user
  async findUserByEmail(email) {
    let sql = "SELECT * FROM users WHERE email = ?";

    try {
      const [rows] = await pool.query(sql, [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async findOneUserById(id) {
    let sql = "SELECT * FROM users WHERE id = ?";
    try {
      const [rows] = await pool.query(sql, [id]);
      if (rows.length > 0) return rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async generateAccessToken(email, password, res) {
    let user = await this.findUserByEmail(email);
    if (!user) {
      return responseStatus(
        res,
        402,
        "failed",
        "Username you entered isn't connected to an account."
      );
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return responseStatus(
        res,
        404,
        "failed",
        "The password that you've entered is incorrect."
      );
    }
    const data = { id: user.id, role: user.role_id, email: user.email };
    let accessToken = await generateToken(data, _tokenSecret, _tokenLife);
    return responseStatus(res, 200, "success", accessToken);
  }
}

module.exports = new AuthService();
