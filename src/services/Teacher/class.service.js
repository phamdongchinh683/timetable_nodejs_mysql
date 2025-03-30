const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { v4: uuidv4 } = require("uuid");

class ClassService {
  async insertMany(classes, res) {
    try {
      const values = classes.map((classItem) => [uuidv4(), classItem.name]);
      let sql = "INSERT INTO classes (id, class_name) VALUES ?";
      const [result] = await pool.query(sql, [values]);
      if (result.affectedRows > 0)
        return responseStatus(res, 200, "success", "Classes created");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async updateOne(id, class_name, res) {
    try {
      let sql = "UPDATE classes SET class_name = ? WHERE id = ?";
      const [result] = await pool.query(sql, [class_name, id]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Class updated");
      }
      return responseStatus(
        res,
        400,
        "failed",
        "Class does not exist or was deleted"
      );
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async deleteMany(ids, res) {
    try {
      let sql = "DELETE FROM classes WHERE id IN (?)";
      const [result] = await pool.query(sql, [ids]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Classes deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Classes not found or already deleted"
      );
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async findOneById(id, res) {
    try {
      let sql = "SELECT * FROM classes WHERE id = ?";
      const [result] = await pool.query(sql, [id]);
      if (result.length > 0) {
        return responseStatus(res, 200, "success", result[0]);
      }
      return responseStatus(res, 404, "failed", "Class not found");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findAll(res) {
    try {
      let sql = "SELECT * FROM classes";
      const [result] = await pool.query(sql);
      if (result.length === 0) {
        return responseStatus(res, 404, "failed", "Current haven't class");
      }
      return responseStatus(res, 200, "success", result);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async findClassByUserId(id) {
    try {
      let sql = `SELECT * FROM students WHERE user_id = ? `;
      const [student] = await pool.query(sql, [id]);
      if (student.length <= 0) {
        return "not found class id";
      }
      return student[0].class_id;
    } catch (error) {
      return error.message;
    }
  }
}

module.exports = new ClassService();
