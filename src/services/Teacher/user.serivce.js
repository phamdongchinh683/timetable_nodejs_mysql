const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { v4: uuidv4 } = require("uuid");
const { hashPassword } = require("../../utils/hashHelper");

class UserService {
  async findAll(res) {
    try {
      let sql = "SELECT * FROM users";
      const [rows] = await pool.query(sql);

      if (rows.length === 0) {
        return responseStatus(res, 404, "failed", "Current haven't user");
      }
      return responseStatus(res, 200, "success", rows);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
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
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async updateUser(id, userData, res) {
    try {
      let sql =
        "UPDATE users SET email = ?, password = ?, role_id = ? WHERE id = ?";
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

  async deleteUser(ids, res) {
    try {
      let sql = "DELETE FROM users WHERE id IN (?)";
      const [result] = await pool.query(sql, [ids]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Users deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Users does not exist or was deleted"
      );
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }
}

module.exports = new UserService();
