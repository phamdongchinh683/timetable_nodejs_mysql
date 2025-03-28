const { responseStatus } = require("../../globals/handler");
const authService = require("../Auth/auth.service");

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
        "UPDATE student SET full_name = ?, age = ?, course = ?, student_code = ? , class_id = ? WHERE id = ?";
      const [result] = await pool.query(sql, [
        data.full_name,
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

  async deleteMany() {
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

  async findOneById() {
    try {
      let sql = "SELECT * FROM students WHERE id = ?";
      const [result] = await pool.query(sql, [id]);
      if (result.length > 0) {
        return responseStatus(res, 200, "success", result[0]);
      }
      return responseStatus(res, 404, "failed", "Student not found");
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
          data.full_name,
          data.age,
          data.course,
          userValues[index][0], // get id user
          data.studentCode,
          data.classId,
        ]);

        await this.connection.query(
          `INSERT INTO users (id, email, password, role_id) VALUES ?`,
          [userValues]
        );

        await this.connection.query(
          `INSERT INTO students (id, full_name, age, course, user_id, student_code, class_id) VALUES ?`,
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
