const express = require('express');
const { testProduct } = require('../controllers/productController');
const router = express.Router();

const { isLoggedIn, CustomRole} = require("../middlewares/user")

router.route("/product").get(testProduct);


module.exports = router;