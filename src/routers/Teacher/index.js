const express = require("express");
const teacherControllers = require("../../controllers/Teacher/teacher.controllers");
const teacherMiddlewares = require("../../middlewares/teacher.middlewares");
const authMiddlewares = require("../../middlewares/auth.middlewares");
const { validateUsersArray } = require("../../validations/auth.validation");
const router = express.Router();

router.post("/sign-in", teacherMiddlewares.isTeacher, teacherControllers.login);

router.use(authMiddlewares.authorization, teacherMiddlewares.teacherRole); // only teacher can access bottom router
//user
router.post(
  "/create-users",
  validateUsersArray,
  teacherControllers.createAccounts
);
//role
router.get("/role-list", teacherControllers.roleList);
router.post("/create-roles", teacherControllers.createRoles);
router.patch("/update-role/:id", teacherControllers.updateRole);
router.delete("/delete-role/:id", teacherControllers.deleteRole);



module.exports = router;
