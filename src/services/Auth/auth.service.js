const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { hashPassword } = require("../../utils/hashHelper");
const { v4: uuidv4 } = require("uuid");

class AuthService {
  // user
  async findUserByEmail(email) {
    let sql = "SELECT * FROM users WHERE email = ?";

    try {
      const [rows] = await pool.query(sql, [email]);
      return responseStatus(res, 200, "success", rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async findOneUserById(id) {
    let sql = "SELECT * FROM users WHERE id = ?";

    try {
      const [rows] = await pool.query(sql, [id]);
      return responseStatus(res, 200, "success", rows[0]);
    } catch (error) {
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
      console.error("updateUser Error:", error);
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
      console.error("deleteUser Error:", error);
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  // role
  async insertManyRoles(roles, res) {
    try {
      const values = roles.map((role) => [uuidv4(), role.name]);

      let sql = "INSERT INTO roles (id, name) VALUES ?";

      const [result] = await pool.query(sql, [values]);
      if (result.affectedRows > 0)
        return responseStatus(res, 200, "success", "Created");
    } catch (error) {
      return responseStatus(res, 400, "failed", error);
    }
  }

  async createRole(roleName, res) {
    try {
      let sql = "INSERT INTO roles (id, name) VALUES (?, ?)";
      const [result] = await pool.query(sql, [uuidv4(), roleName]);

      if (result.affectedRows > 0)
        return responseStatus(res, 200, "success", "Role created");
    } catch (error) {
      return responseStatus(res, 500, "failed", error);
    }
  }

  async findRoleById(id) {
    try {
      let sql = "SELECT * FROM roles WHERE id = ?";

      const [result] = await pool.query(sql, [id]);
      if (result > 0) return responseStatus(res, 200, "success", "Created");
    } catch (error) {
      return responseStatus(res, 400, "failed", error);
    }
  }

  async findAllRoles(res) {
    try {
      let sql = "SELECT * FROM roles";
      const [rows] = await pool.query(sql);

      if (rows.length === 0) {
        return responseStatus(res, 404, "failed", "No roles found");
      }
      return responseStatus(res, 200, "success", rows);
    } catch (error) {
      console.error("findAllRoles Error:", error);
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async updateRole(id, roleName, res) {
    try {
      let sql = "UPDATE roles SET name = ? WHERE id = ?";
      const [result] = await pool.query(sql, [roleName, id]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Role updated");
      }
      return responseStatus(res, 400, "failed", "Role update failed");
    } catch (error) {
      console.error("updateRole Error:", error);
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async deleteRole(id, res) {
    try {
      let sql = "DELETE FROM roles WHERE id = ?";
      const [result] = await pool.query(sql, [id]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Role deleted");
      }
      return responseStatus(res, 404, "failed", "Role not found");
    } catch (error) {
      console.error("deleteRole Error:", error);
      return responseStatus(res, 500, "failed", error.message);
    }
  }


}

module.exports = new AuthService();
