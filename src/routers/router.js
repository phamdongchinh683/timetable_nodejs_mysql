const studentRouter = require("./Student");
const teacherRouter = require("./Teacher");

function router(app) {
  app.use("/api/student", studentRouter);
  app.use("/api/teacher", teacherRouter);
}

module.exports = router;
