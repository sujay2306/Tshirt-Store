const express = require('express');
const router = express.Router();
// const {signUp} = ("../controllers/userController");
const {signUp, login } = require ("../controllers/userController")

router.route("/signup").post(signUp)
router.route("/login").post(login)

module.exports = router;

