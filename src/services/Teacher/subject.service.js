const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { v4: uuidv4 } = require("uuid");

class SubjectService {
  async insertMany(subjects, res) {
    try {
      const values = subjects.map((subject) => [
        uuidv4(),
        subject.name,
        subject.year,
        subject.semester,
      ]);

      let sql = "INSERT INTO subjects (id, name, year, semester) VALUES ?";
      const [result] = await pool.query(sql, [values]);

      if (result.affectedRows > 0)
        return responseStatus(res, 200, "success", "Subjects created");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findById(id, res) {
    try {
      let sql = "SELECT * FROM subjects WHERE id = ?";
      const [result] = await pool.query(sql, [id]);

      if (result.length > 0) {
        return responseStatus(res, 200, "success", result[0]);
      }
      return responseStatus(res, 404, "failed", "Subject not found");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findAll(res) {
    try {
      let sql = "SELECT * FROM subjects";
      const [rows] = await pool.query(sql);

      if (rows.length === 0) {
        return responseStatus(res, 404, "failed", "No subjects found");
      }
      return responseStatus(res, 200, "success", rows);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async updateOne(id, data, res) {
    try {
      let sql =
        "UPDATE subjects SET name = ?, year = ?, semester = ? WHERE id = ?";
      const [result] = await pool.query(sql, [
        data.name,
        data.year,
        data.semester,
        id,
      ]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Subject updated");
      }
      return responseStatus(
        res,
        400,
        "failed",
        "Subject does not exist or was deleted"
      );
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async deleteMany(ids, res) {
    if (!ids || ids.length === 0) {
      return responseStatus(
        res,
        400,
        "failed",
        "Please provide valid subject IDs"
      );
    }

    try {
      let sql = "DELETE FROM subjects WHERE id IN (?)";
      const [result] = await pool.query(sql, [ids]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Subjects deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Subjects not found or already deleted"
      );
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }
}

module.exports = new SubjectService();
