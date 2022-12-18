const express = require('express');
const router = express.Router();
//calling from controller
const {home, dummy} = require("../controllers/homeController");


//.get chain on home 
router.route("/").get(home);
//.get chain on dummy
router.route("/dummy").get(dummy);

module.exports = router;