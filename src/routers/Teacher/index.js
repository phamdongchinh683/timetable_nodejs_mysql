const express = require("express");
const teacherControllers = require("../../controllers/Teacher/teacher.controllers");
const teacherMiddlewares = require("../../middlewares/teacher.middlewares");
const authMiddlewares = require("../../middlewares/auth.middlewares");
const {
  validateUsersArray,
  validateUser,
} = require("../../validations/user.validation");
const { validateRooms } = require("../../validations/room.validation");
const { validateClasses } = require("../../validations/class.validation");
const {
  validateSubjects,
  validateUpdateSubject,
} = require("../../validations/subject.validation");
const router = express.Router();

router.post("/sign-in", teacherMiddlewares.isTeacher, teacherControllers.login);

router.use(authMiddlewares.authorization, teacherMiddlewares.teacherRole); // only teacher can access bottom router
//user
router.post(
  "/create-users",
  validateUsersArray,
  teacherControllers.createAccounts
);
router.get("/user-list", teacherControllers.accountList);
router.patch(
  "/update-user/:id",
  validateUser,
  teacherControllers.updateAccount
);
router.delete("/delete-users", teacherControllers.deleteAccounts);
//role
router.get("/role-list", teacherControllers.roleList);
router.post("/create-roles", teacherControllers.createRoles);
router.patch("/update-role/:id", teacherControllers.updateRole);
router.delete("/delete-role/:id", teacherControllers.deleteRole);

// rooms
router.get("/room-list", teacherControllers.roomList);
router.post("/create-rooms", validateRooms, teacherControllers.createRooms);
router.patch("/update-room/:id", teacherControllers.updateRoom);
router.delete("/delete-rooms", teacherControllers.deleteRooms);

//class
router.get("/class-list", teacherControllers.classList);
router.post(
  "/create-classes",
  validateClasses,
  teacherControllers.createClasses
);
router.patch("/update-class/:id", teacherControllers.updateClass);
router.delete("/delete-classes", teacherControllers.deleteClasses);

//subject
router.get("/subject-list", teacherControllers.subjectList);
router.post(
  "/create-subjects",
  validateSubjects,
  teacherControllers.createSubjects
);
router.patch(
  "/update-subject/:id",
  validateUpdateSubject,
  teacherControllers.updateSubject
);
router.delete("/delete-subjects", teacherControllers.deleteSubjects);

module.exports = router;
