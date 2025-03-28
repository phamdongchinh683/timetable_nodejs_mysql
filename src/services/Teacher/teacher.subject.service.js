const { pool } = require("../../config/database.config");
const NodeCache = require("node-cache");
const { responseStatus } = require("../../globals/handler");
const { v4: uuidv4 } = require("uuid");

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

class SubjectTeacherService {
  async insertMany(subjectTeachers, res) {
    try {
      const values = subjectTeachers.map((item) => [
        uuidv4(),
        item.subjectId,
        item.teacherId,
      ]);

      let sql =
        "INSERT INTO subject_teacher (id, subject_id, teacher_id) VALUES ?";
      const [result] = await pool.query(sql, [values]);

      if (result.affectedRows > 0) {
        return responseStatus(
          res,
          200,
          "success",
          "Subject-Teacher relationships created"
        );
      }
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findByTeacherId(id, res) {
    const cachedData = myCache.get(id);
    if (cachedData) {
      return cachedData;
    }
    try {
      let sql =
        "SELECT * FROM subject_teacher WHERE subject_teacher.teacher_id  = ?";
      const [result] = await pool.query(sql, [id]);

      if (result.length > 0) {
        myCache.set(id, result, 100);
        return responseStatus(res, 200, "success", result);
      }
      return responseStatus(res, 404, "failed", "Not found");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findAll(res) {
    try {
      let sql = "SELECT * FROM subject_teacher";
      const [rows] = await pool.query(sql);

      if (rows.length === 0) {
        return responseStatus(
          res,
          404,
          "failed",
          "No subject-teacher relationships found"
        );
      }
      return responseStatus(res, 200, "success", rows);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async updateOne(id, subject_id, teacher_id, res) {
    try {
      let sql =
        "UPDATE subject_teacher SET subject_id = ?, teacher_id = ? WHERE id = ?";
      const [result] = await pool.query(sql, [subject_id, teacher_id, id]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "updated");
      }
      return responseStatus(res, 400, "failed", "Not found or deleted");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async deleteMany(ids, res) {
    try {
      let sql = "DELETE FROM subject_teacher WHERE id IN (?)";
      const [result] = await pool.query(sql, [ids]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Deleted");
      }
      return responseStatus(res, 404, "failed", "Not found or before deleted");
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }
}

module.exports = new SubjectTeacherService();
