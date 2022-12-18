const express = require('express');
const router = express.Router();
const {signup} = ("../controllers/userController");


router.route("/signup").get(signup)











module.exports = router;
