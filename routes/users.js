const express = require('express');
const router = express.Router();
// const {signUp} = ("../controllers/userController");
const {signUp, login, logout, forgotPassword, passwordReset} = require ("../controllers/userController")

router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgotPassword").post(forgotPassword)
router.route("/password/reset/:token").post(passwordReset)

module.exports = router;

