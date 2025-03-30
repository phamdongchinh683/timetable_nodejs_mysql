const { pool, initConnect } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { hashPassword } = require("../../utils/hashHelper");
const authService = require("../Auth/auth.service");
const { v4: uuidv4 } = require("uuid");

class TeacherService {
  async updateOne(id, data, res) {
    try {
      let sql = "UPDATE teachers SET level = ?, full_name = ? WHERE id = ?";
      const [result] = await pool.query(sql, [data.level, data.full_name, id]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Room updated");
      }
      return responseStatus(res, 400, "failed", "Not change");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async deleteMany(ids, res) {
    try {
      let sql = "DELETE FROM teachers WHERE id IN (?)";
      const [result] = await pool.query(sql, [ids]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Rooms deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Rooms not found or already deleted"
      );
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async findOneById(id, res) {
    try {
      let sql = "SELECT * FROM teachers WHERE id = ?";
      const [result] = await pool.query(sql, [id]);
      if (result.length > 0) {
        return responseStatus(res, 200, "success", result[0]);
      }
      return responseStatus(res, 404, "failed", "Room not found");
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
          user.role_id,
        ])
      );
      const teacherValues = data.map((teacher, index) => [
        uuidv4(),
        userValues[index][0], // get id user
        teacher.level,
        teacher.full_name,
      ]);

      await connection.query(
        `INSERT INTO users (id, email, password, role_id) VALUES ?`,
        [userValues]
      );

      await connection.query(
        `INSERT INTO teachers (id, user_id, level, full_name) VALUES ?`,
        [teacherValues]
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
      let sql = "SELECT * FROM teachers";
      const [result] = await pool.query(sql);
      if (result.length === 0) {
        return responseStatus(res, 404, "failed", "Current haven't teacher");
      }
      return responseStatus(res, 200, "success", result);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }
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

  async findTeacherByUserId(id) {
    try {
      let sql = `SELECT * FROM teachers WHERE user_id = ? `;
      const [teacher] = await pool.query(sql, [id]);
      if (teacher.length <= 0) {
        return "not found teacher id";
      }
      return teacher[0].id;
    } catch (error) {
      return error.message;
    }
  }
}

module.exports = new TeacherService();
