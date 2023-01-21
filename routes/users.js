const express = require('express');
const router = express.Router();
// const {signUp} = ("../controllers/userController");
const {signUp, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails} = require ("../controllers/userController");
const { isLoggedIn } = require('../middlewares/user');

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails); //req will first goes to isLoggedIn to verify thn get sdashboard
module.exports = router;

