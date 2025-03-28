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
const {
  validateAccountsTeacherArray,
  validateAccountTeacher,
} = require("../../validations/teacher.account.vaidation");
const {
  validateAccountsStudentArray,
  validateAccountStudent,
} = require("../../validations/student.account.validation");
const {
  validateSubjectTeacherArray,
  validateSubjectTeacher,
} = require("../../validations/subject.teacher.validation");
const router = express.Router();

//login
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

// create account teacher

router.post(
  "/create-accounts-teacher",
  validateAccountsTeacherArray,
  teacherControllers.createAccountTeacher
);
router.patch(
  "/update-account-teacher/:id",
  validateAccountTeacher,
  teacherControllers.updateAccountTeacher
);

router.delete(
  "/delete-accounts-teacher",
  teacherControllers.deleteAccountsTeacher
);

router.get("/account-teacher-list", teacherControllers.AccountTeacherList);

// create account student

router.post(
  "/create-accounts-student",
  validateAccountsStudentArray,
  teacherControllers.createAccountStudent
);

router.get("/account-student/:id", teacherControllers.detailStudent);

router.patch(
  "/update-account-student/:id",
  validateAccountStudent,
  teacherControllers.updateAccountStudent
);

router.delete(
  "/delete-accounts-student",
  teacherControllers.deleteAccountsStudent
);

router.get("/account-student-list", teacherControllers.AccountStudentList);

// insert subject for teacher

router.post(
  "/create-subject-teacher",
  validateSubjectTeacher,
  teacherControllers.createSubjectForTeacher
);

router.get("/teacher/:id", teacherControllers.detailTeacher);

router.patch(
  "/update-subject-teacher/:id",
  validateSubjectTeacher,
  teacherControllers.updateSubjectTeacher
);

router.delete(
  "/delete-subject-teacher",
  teacherControllers.deleteSubjectTeacher
);

router.get("/subject-teacher-list", teacherControllers.SubjectTeacherList);

module.exports = router;
