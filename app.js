const express = require('express');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
//swagger doc
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//regular middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookies and files;
app.use(cookieParser());
app.use(fileUpload());

//morgan middleware
app.use(morgan("tiny"));

//import all routes here
const home = require("./routes/home");

// mount the specified middleware function(s) at the path which is being specified.
//this is the router middleware
app.use('/api/v1', home);



module.exports = app;
//export app js 