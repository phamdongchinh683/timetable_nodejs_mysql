const { pool } = require("../../config/database.config");
const NodeCache = require("node-cache");
const { responseStatus } = require("../../globals/handler");
const { v4: uuidv4 } = require("uuid");

const myCache = new NodeCache({ stdTTL: 20, checkperiod: 120 });

class SubjectTeacherService {
  async insertOne(subjectTeachers, res) {
    try {
      const queryCount = `
          SELECT COUNT(*) AS count
          FROM teacher_subjects ts
          WHERE ts.teacher_id = ?
        `;

      let [rows] = await pool.query(queryCount, [subjectTeachers.teacherId]);

      let count = rows[0].count; // count subject of teacher

      if (count >= 3) {
        return responseStatus(
          res,
          400,
          "failed",
          "This lecturer is currently teaching 3 subjects."
        );
      }
      let sql =
        "INSERT INTO teacher_subjects (id, subject_id, teacher_id) VALUES (? ,?, ?)";
      const [result] = await pool.query(sql, [
        uuidv4(),
        subjectTeachers.subjectId,
        subjectTeachers.teacherId,
      ]);

      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "added subject for teacher");
      }
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findByTeacherId(id, res) {
    const cachedData = myCache.get(id);
    if (cachedData) {
      return responseStatus(res, 200, "success", cachedData);
    }
    try {
      let sql = `
        SELECT s.name as subject from teacher_subjects ts
        LEFT JOIN subjects s on s.id = ts.subject_id
        where ts.teacher_id = ?
      `;
      const [result] = await pool.query(sql, [id]);

      if (result.length > 0) {
        myCache.set(id, result, 10);
        return responseStatus(res, 200, "success", result);
      }
      return responseStatus(res, 404, "failed", "Not found");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findAll(res) {
    try {
      const sql = `
      SELECT 
        t.id AS teacherId,
        t.full_name AS teacherName,
        s.id as subjectID,
        s.name AS subject
      FROM 
        teacher_subjects ts
      LEFT JOIN 
        teachers t ON t.id = ts.teacher_id
      LEFT JOIN 
        subjects s ON s.id = ts.subject_id;
    `;
      const [rows] = await pool.query(sql);

      if (rows.length === 0) {
        return responseStatus(
          res,
          404,
          "failed",
          "No data subject for teacher"
        );
      }
      return responseStatus(res, 200, "success", rows);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async updateOne(id, data, res) {
    try {
      let sql =
        "UPDATE teacher_subjects SET subject_id = ?, teacher_id = ? WHERE id = ?";
      const [result] = await pool.query(sql, [
        data.subjectId,
        data.teacherId,
        id,
      ]);

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
      let sql = "DELETE FROM teacher_subjects WHERE id IN (?)";
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
