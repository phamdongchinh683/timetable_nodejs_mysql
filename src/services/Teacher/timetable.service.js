const { v4: uuidv4 } = require("uuid");
const { pool, initConnect } = require("../../config/database.config");
const { responseStatus } = require("../../globals/handler");
const notificationService = require("./notification.service");
const classService = require("./class.service");
const teacherService = require("./teacher.service");

class TimetableService {
  async insertOne(timetable, userId) {
    let connection;

    try {
      connection = await initConnect;

      const values = [
        uuidv4(),
        timetable.classId,
        timetable.teacherSubjectId,
        timetable.roomId,
        timetable.period,
        timetable.dayOfWeek,
        timetable.status,
        timetable.lesson,
        timetable.startDate,
        timetable.endDate,
      ];

      let sql = `INSERT INTO timetables (id, class_id, teacher_subject_id, room_id, period, day_of_week, status, lesson, start_date_study, end_date_study) VALUES (? ,?, ?, ?, ?, ?, ?, ? ,?, ?)`;
      const [result] = await pool.query(sql, values);

      if (result.affectedRows === 0) {
        return "failed";
      }
      const notification = {
        userId: userId,
        classId: timetable.classId,
        message: `There is a new schedule. ${timetable.classId}`,
      };
      const createNotification = await notificationService.insertOne(
        notification
      );

      if (createNotification.affectedRows === 0) {
        return "failed";
      }
      await connection.commit();
      return createNotification;
    } catch (error) {
      return error.message;
    }
  }

  async updateOne(id, userId, timetable, res) {
    let sql = `UPDATE timetables
    SET class_id = ?, teacher_subject_id = ?, room_id = ?, period = ?, day_of_week = ?, status = ?, lesson = ?, start_date_study =? , end_date_study = ?
    WHERE id=?`;

    const [result] = await pool.query(sql, [
      timetable.classId,
      timetable.teacherSubjectId,
      timetable.roomId,
      timetable.period,
      timetable.dayOfWeek,
      timetable.status,
      timetable.lesson,
      timetable.startDate,
      timetable.endDate,
      id,
    ]);

    if (result.affectedRows > 0) {
      const notification = {
        userId: userId,
        classId: timetable.classId,
        message: `Timetable has been updated - ${
          timetable.classId
        } - ${new Date().toLocaleString()}`,
      };

      const insertNotification = await notificationService.insertOne(
        notification
      );
      if (insertNotification.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Timetable updated");
      } else {
        return responseStatus(
          res,
          400,
          "error",
          "Timetable updated, but notification failed"
        );
      }
    }

    return responseStatus(
      res,
      400,
      "failed",
      "Timetable does not exist or was deleted"
    );
  }
  catch(error) {
    return responseStatus(res, 400, "failed", error.message);
  }

  async deleteMany(ids, res) {
    try {
      let sql = "DELETE FROM timetables WHERE id IN (?)";
      const [result] = await pool.query(sql, [ids]);
      if (result.affectedRows > 0) {
        return responseStatus(res, 200, "success", "Timetables deleted");
      }
      return responseStatus(
        res,
        404,
        "failed",
        "Timetable not found or already deleted"
      );
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async findAll(res) {
    try {
      let sql = `
     SELECT 
         t.id,
         t.day_of_week,
         r.name AS room,
         c.class_name AS class,
         t.lesson,
         t.period,
         t.status,
         t.start_date_study as start,
         t.end_date_study as end,
         te.full_name AS teacher,
         s.name AS subject
     FROM timetables t
     LEFT JOIN rooms r ON r.id = t.room_id
     LEFT JOIN classes c ON c.id = t.class_id
     LEFT JOIN teacher_subjects ts ON ts.id = t.teacher_subject_id
     LEFT JOIN teachers te ON te.id = ts.teacher_id
     LEFT JOIN subjects s ON s.id = ts.subject_id;
 `;

      const [rows] = await pool.query(sql);

      if (rows.length === 0) {
        return responseStatus(res, 404, "failed", "Current haven't timetable");
      }
      return responseStatus(res, 200, "success", rows);
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  }

  async findByTeacherId(id, res) {
    let sql = `
   SELECT 
       t.id,
       t.day_of_week,
       r.name AS room,
       c.class_name AS class,
       t.lesson,
       t.period,
       t.status,
       t.start_date_study,
       t.end_date_study,
       te.full_name AS teacher,
       s.name AS subject
   FROM timetables t
   LEFT JOIN rooms r ON r.id = t.room_id
   LEFT JOIN classes c ON c.id = t.class_id
   LEFT JOIN teacher_subjects ts ON ts.id = t.teacher_subject_id
   LEFT JOIN teachers te ON te.id = ts.teacher_id
   LEFT JOIN subjects s ON s.id = ts.subject_id
   WHERE t.id = ?
`;

    const [rows] = await pool.query(sql, [id]);
    return rows.length > 0
      ? responseStatus(res, 200, "success", rows)
      : responseStatus(
          res,
          400,
          "failed",
          "There is not timetable for this teacher"
        );
  }

  async findByClassId(id, res) {
    const classId = await classService.findClassByUserId(id);
    if (!classId) {
      return responseStatus(res, 400, "failed", "Not found class Id");
    }

    let sql = `
   SELECT 
       t.id,
       t.day_of_week,
       r.name AS room,
       c.class_name AS class,
       t.lesson,
       t.period,
       t.status,
       t.start_date_study,
       te.full_name AS teacher,
       s.name AS subject
   FROM timetables t
   LEFT JOIN rooms r ON r.id = t.room_id
   LEFT JOIN classes c ON c.id = t.class_id
   LEFT JOIN teacher_subjects ts ON ts.id = t.teacher_subject_id
   LEFT JOIN teachers te ON te.id = ts.teacher_id
   LEFT JOIN subjects s ON s.id = ts.subject_id
   WHERE c.id = ?
`;
    const [result] = await pool.query(sql, [classId]);
    if (result.length > 0) {
      return responseStatus(res, 200, "success", result);
    }
    return responseStatus(res, 400, "failed", "Current you haven't timetable");
  }

  async findOneById(id, res) {
    const teacherId = await teacherService.findTeacherByUserId(id);
    if (!teacherId) {
      return responseStatus(res, 400, "failed", "Not found teacher id");
    }

    let sql = `
   SELECT 
       t.id,
       t.day_of_week,
       r.name AS room,
       c.class_name AS class,
       t.lesson,
       t.period,
       t.status,
       t.start_date_study,
       te.full_name AS teacher,
       s.name AS subject
   FROM timetables t
   LEFT JOIN rooms r ON r.id = t.room_id
   LEFT JOIN classes c ON c.id = t.class_id
   LEFT JOIN teacher_subjects ts ON ts.id = t.teacher_subject_id
   LEFT JOIN teachers te ON te.id = ts.teacher_id
   LEFT JOIN subjects s ON s.id = ts.subject_id
   WHERE te.id = ?
`;
    const [result] = await pool.query(sql, [teacherId]);
    if (result.length > 0) {
      return responseStatus(res, 200, "success", result);
    }
    return responseStatus(res, 400, "failed", "Current you haven't timetable");
  }
}

module.exports = new TimetableService();
