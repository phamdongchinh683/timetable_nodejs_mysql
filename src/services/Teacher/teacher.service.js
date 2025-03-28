const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const authService = require("../Auth/auth.service");

class TeacherService {
  async updateOne(id, data, res) {
    try {
      let sql = "UPDATE teacher SET level = ?, full_name = ? WHERE id = ?";
      const [result] = await pool.query(sql, [data.level, data.full_name, id]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Room updated");
      }
      return responseStatus(
        res,
        400,
        "failed",
        "Room does not exist or was deleted"
      );
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async deleteMany() {
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

  async findOneById() {
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

  async insertMany(dataArray, batchSize = 1000) {
    try {
      await pool.beginTransaction();

      for (let i = 0; i < dataArray.length; i += batchSize) {
        const batch = dataArray.slice(i, i + batchSize);

        const userValues = batch.map((data) => [
          uuidv4(),
          data.email,
          data.password,
          data.role_id,
        ]);
        const teacherValues = batch.map((data, index) => [
          uuidv4(),
          userValues[index][0], // get id user
          data.level,
          data.full_name,
        ]);

        await this.connection.query(
          `INSERT INTO users (id, email, password, role_id) VALUES ?`,
          [userValues]
        );

        await this.connection.query(
          `INSERT INTO teachers (id, user_id, level, full_name) VALUES ?`,
          [teacherValues]
        );
      }

      await pool.commit();
    } catch (err) {
      await pool.rollback();
      throw err;
    }
  }

  async findAll(res) {
    try {
      let sql = "SELECT * FROM teachers";
      const [result] = await pool.query(sql);
      if (result.length === 0) {
        return responseStatus(res, 404, "failed", "Current haven't room");
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
}

module.exports = new TeacherService();
