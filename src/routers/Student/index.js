const express = require("express");
const studentControllers = require("../../controllers/Student/student.controllers");
const authMiddlewares = require("../../middlewares/auth.middlewares");
const studentMiddlewares = require("../../middlewares/student.middlewares");
const router = express.Router();

router.post("/sign-in", studentMiddlewares.isStudent, studentControllers.login);

router.use(authMiddlewares.authorization, studentMiddlewares.studentRole);

router.get("/profile", studentControllers.profile);

module.exports = router;
