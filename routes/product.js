const express = require('express');
const {  } = require('../controllers/productController');
const router = express.Router();

const { isLoggedIn, CustomRole} = require("../middlewares/user")

router.route("/product").get();


module.exports = router;