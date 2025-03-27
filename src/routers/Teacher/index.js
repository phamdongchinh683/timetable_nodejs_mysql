const express = require("express");
const teacherControllers = require("../../controllers/Teacher/teacher.controllers");
const teacherMiddlewares = require("../../middlewares/teacher.middlewares");
const authMiddlewares = require("../../middlewares/auth.middlewares");
const { validateUsersArray } = require("../../validations/auth.validation");
const router = express.Router();

router.post("/sign-in", teacherMiddlewares.isTeacher, teacherControllers.login);

router.use(authMiddlewares.authorization, teacherMiddlewares.teacherRole); // only teacher can access bottom router
router.post(
  "/create-users",
  validateUsersArray,
  teacherControllers.createAccounts
);
router.post("/create-roles", teacherControllers.createRoles);
router.patch("/update-role", teacherControllers.createRoles);
router.get("/role-list", teacherControllers.createRoles);
router.post("/delete-role", teacherControllers.createRoles);

module.exports = router;
