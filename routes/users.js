const express = require('express');
const router = express.Router();
// const {signUp} = ("../controllers/userController");
const {signUp } = require ("../controllers/userController")

router.route("/signup").get(signUp)


module.exports = router;

