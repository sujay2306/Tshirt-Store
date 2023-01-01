const express = require('express');
const router = express.Router();
// const {signUp} = ("../controllers/userController");
const {signUp, login, logout, forgotPassword} = require ("../controllers/userController")

router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgotPassword").post(forgotPassword)

module.exports = router;

