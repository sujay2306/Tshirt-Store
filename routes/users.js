const express = require('express');
const router = express.Router();
// const {signUp} = ("../controllers/userController");
const {signUp, login, logout} = require ("../controllers/userController")

router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/logout").get(logout)

module.exports = router;

