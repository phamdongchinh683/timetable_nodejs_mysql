const { pool } = require("../../config/database.config");
const NodeCache = require("node-cache");
const { responseStatus } = require("../../globals/handler");
const { v4: uuidv4 } = require("uuid");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

class RoleService {
  // role
  async insertManyRoles(roles, res) {
    try {
      const values = roles.map((role) => [uuidv4(), role.name]);

      let sql = "INSERT INTO roles (id, name) VALUES ?";

      const [result] = await pool.query(sql, [values]);
      if (result.affectedRows > 0)
        return responseStatus(res, 200, "success", "Created");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
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
    const cachedRole = myCache.get(id);
    if (cachedRole) {
      return cachedRole;
    }
    try {
      let sql = "SELECT * FROM roles WHERE id = ?";
      const [result] = await pool.query(sql, [id]);
      if (result.length > 0) {
        myCache.set(id, result[0].name, 100);
        return result[0].name;
      } else {
        return "Not found role";
      }
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
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async updateOne(id, name, res) {
    try {
      let sql = "UPDATE roles SET name = ? WHERE id = ?";
      const [result] = await pool.query(sql, [name, id]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Updated");
      }
      return responseStatus(
        res,
        400,
        "failed",
        "This role exist or before deletes"
      );
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async deleteOne(id, res) {
    try {
      let sql = "DELETE FROM roles WHERE id = ?";
      const [result] = await pool.query(sql, [id]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Role deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "This role deleted or not exist"
      );
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }
}

module.exports = new RoleService();
