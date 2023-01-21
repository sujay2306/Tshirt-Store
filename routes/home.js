const express = require('express');
const router = express.Router();
//calling from controller
const {home, dummy} = require("../controllers/homeController");


//.get chain on home 
router.route("/").get(home);
module.exports = router;