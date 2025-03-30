const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const { v4: uuidv4 } = require("uuid");

class RoomService {
  async insertMany(rooms, res) {
    try {
      const values = rooms.map((room) => [uuidv4(), room.name]);
      let sql = "INSERT INTO rooms (id, name) VALUES ?";
      const [result] = await pool.query(sql, [values]);
      if (result.affectedRows > 0)
        return responseStatus(res, 200, "success", "Rooms created");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findAll(res) {
    try {
      let sql = "SELECT * FROM rooms";
      const [result] = await pool.query(sql);
      if (result.length === 0) {
        return responseStatus(res, 404, "failed", "Current haven't room");
      }
      return responseStatus(res, 200, "success", result);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async updateOne(id, name, res) {
    try {
      let sql = "UPDATE rooms SET name = ? WHERE id = ?";
      const [result] = await pool.query(sql, [name, id]);
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

  async deleteMany(ids, res) {
    try {
      let sql = "DELETE FROM rooms WHERE id IN (?)";
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
      let sql = "SELECT * FROM rooms WHERE id = ?";
      const [result] = await pool.query(sql, [id]);
      if (result.length > 0) {
        return responseStatus(res, 200, "success", result[0]);
      }
      return responseStatus(res, 404, "failed", "Room not found");
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }

  async findAllRoomEmptyByDayOfWeek(dayOfWeek, date, res) {
    try {
      let sql = `
      SELECT l.lesson, p.period, r.name AS room_name
      FROM (
          SELECT 'Morning' AS lesson UNION 
          SELECT 'Afternoon' AS lesson UNION 
          SELECT 'Evening' AS lesson
      ) l
      CROSS JOIN (
          SELECT '1-3' AS period UNION 
          SELECT '4-6' AS period
      ) p
      CROSS JOIN rooms r
      LEFT JOIN timetables t ON r.id = t.room_id
          AND l.lesson = t.lesson
          AND p.period = t.period
          AND t.day_of_week = ?
          AND ? BETWEEN t.start_date_study AND t.end_date_study
      WHERE t.id IS NULL;
    `;

      const [result] = await pool.query(sql, [dayOfWeek, date]);
      if (result.length > 0) {
        return responseStatus(res, 200, "success", result);
      }
      return responseStatus(
        res,
        404,
        "failed",
        "There are currently no rooms available"
      );
    } catch (error) {
      return responseStatus(res, 400, "failed", error.message);
    }
  }
}

module.exports = new RoomService();
