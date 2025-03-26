const express = require("express");
const teacherControllers = require("../../controllers/Teacher/teacher.controllers");
const router = express.Router();

router.post("/create-users", teacherControllers.createAccounts);
router.post("/create-roles", teacherControllers.createRoles);

module.exports = router;
