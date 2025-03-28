const { responseStatus } = require("../../globals/handler");
const authService = require("../Auth/auth.service");
const { v4: uuidv4 } = require("uuid");
const { hashPassword } = require("../../utils/hashHelper");
const { initConnect, pool } = require("../../config/database.config");

class StudentService {
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

  async updateOne(id, data, res) {
    try {
      let sql =
        "UPDATE students SET full_name = ?, age = ?, course = ?, student_code = ? , class_id = ? WHERE id = ?";
      const [result] = await pool.query(sql, [
        data.fullName,
        data.age,
        data.course,
        data.studentCode,
        data.classId,
        id,
      ]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Room updated");
      }
      return responseStatus(
        res,
        400,
        "failed",
        "Student does not exist or was deleted"
      );
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async deleteMany(ids, res) {
    try {
      let sql = "DELETE FROM students WHERE id IN (?)";
      const [result] = await pool.query(sql, [ids]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Student not found or already deleted"
      );
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async findOneById(id, res) {
    try {
      let sql =
        "SELECT s.full_name, s.age, s.course, s.student_code, c.class_name " +
        "FROM students s " +
        "LEFT JOIN classes c ON c.id = s.class_id " +
        "WHERE s.id = ?";
      const [result] = await pool.query(sql, [id]);
      if (result.length > 0) {
        return responseStatus(res, 200, "success", result[0]);
      }
      return responseStatus(res, 404, "failed", "Student not found");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async insertMany(data, res) {
    let connection;

    try {
      connection = await initConnect;

      await connection.beginTransaction();

      const userValues = await Promise.all(
        data.map(async (user) => [
          uuidv4(),
          user.email,
          await hashPassword(user.password),
          user.roleId,
        ])
      );
      const studentValues = data.map((student, index) => [
        uuidv4(),
        student.fullName,
        student.age,
        student.course,
        userValues[index][0], // get id user
        student.studentCode,
        student.classId,
      ]);

      const studentClassValues = data.map((student, index) => [
        uuidv4(),
        studentValues[index][0], // get student id
        studentValues[index][6],
      ]);

      await connection.query(
        `INSERT INTO users (id, email, password, role_id) VALUES ?`,
        [userValues]
      );

      await connection.query(
        `INSERT INTO students (id, full_name, age, course,user_id, student_code, class_id) VALUES ?`,
        [studentValues]
      );

      await connection.query(
        `INSERT INTO student_classes (id, student_id, class_id) VALUES ?`,
        [studentClassValues]
      );

      await connection.commit();
      return responseStatus(res, 200, "success", "Created");
    } catch (err) {
      await connection.rollback();
      throw err;
    }
  }

  async findAll(res) {
    try {
      let sql = "SELECT * FROM students";
      const [result] = await pool.query(sql);
      if (result.length === 0) {
        return responseStatus(res, 404, "failed", "Current haven't student");
      }
      return responseStatus(res, 200, "success", result);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }
}

module.exports = new StudentService();
