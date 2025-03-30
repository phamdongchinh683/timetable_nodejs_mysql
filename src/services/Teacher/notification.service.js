const { v4: uuidv4 } = require("uuid");
const { pool } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");

class NotificationService {
  async insertOne(notification) {
    try {
      const values = [
        uuidv4(),
        notification.userId,
        notification.classId,
        notification.message,
      ];

      let sql = `
        INSERT INTO notifications 
        (id, user_id, class_id, message) 
        VALUES (?, ?, ?, ?)
      `;
      let [result] = await pool.query(sql, values);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateOne(id, message, res) {
    try {
      let sql = `UPDATE notifications SET message = ? WHERE id = ?`;
      const [result] = await pool.query(sql, [message, id]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Notification updated");
      }
      return responseStatus(
        res,
        400,
        "failed",
        "Notification does not exist or was deleted"
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteMany(ids, res) {
    try {
      let sql = `DELETE FROM notifications WHERE id IN (?)`;
      const [result] = await pool.query(sql, [ids]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Notification deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Notifications not found or already deleted"
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getNotificationByClassId(id, res) {
    let sql;
    try {
      sql = `SELECT * FROM students WHERE user_id = ? `;
      const [student] = await pool.query(sql, [id]);
      if (student.length <= 0) {
        return responseStatus(res, 400, "failed", "not found class id");
      }
      sql = `SELECT * FROM notifications WHERE class_id = ?`;
      const [result] = await pool.query(sql, [student[0].class_id]);
      if (result.length > 0) {
        return responseStatus(res, 200, "success", result);
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Notifications not found or already deleted"
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new NotificationService();
