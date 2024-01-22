const express = require("express");
const router = express.Router();
const controller = require("../controller/userForm");


router.route("/signUp").post(controller.userSignUp);
router.route("/login").post(controller.login);

module.exports = router;
