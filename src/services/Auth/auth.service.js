const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { _tokenSecret, _tokenLife } = require("../../globals/secretKey");
const { hashPassword, comparePassword } = require("../../utils/hashHelper");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../../utils/tokenGenerator");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

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

  async insertManyUsers(users, res) {
    try {
      const values = await Promise.all(
        users.map(async (user) => [
          uuidv4(),
          user.email,
          await hashPassword(user.password),
          user.role_id,
        ])
      );

      let sql = "INSERT INTO users (id, email, password, role_id) VALUES ?";

      const [result] = await pool.query(sql, [values]);
      if (result.affectedRows > 0)
        return responseStatus(res, 200, "success", "Created");
    } catch (error) {
      return responseStatus(res, 500, "failed", error);
    }
  }

  async updateUser(id, userData, res) {
    try {
      let sql =
        "UPDATE users SET email = ?, password = ?, role_id = ?, updated_at = ? WHERE id = ?";
      const [result] = await pool.query(sql, [
        userData.email,
        await hashPassword(userData.password),
        userData.role_id,
        new Date(),
        id,
      ]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "User updated");
      }
      return responseStatus(res, 400, "failed", "User update failed");
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async deleteUser(id, res) {
    try {
      let sql = "DELETE FROM users WHERE id = ?";
      const [result] = await pool.query(sql, [id]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "User deleted");
      }
      return responseStatus(res, 404, "failed", "User not found");
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
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
