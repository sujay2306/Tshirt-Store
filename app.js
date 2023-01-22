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



//just a temp check
app.set("view engine", "ejs")

//regular middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookies and files;
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles : true,
    useFileDir : "/tmp/"
}
));

//morgan middleware
app.use(morgan("tiny"));

//import all routes here
const home = require("./routes/home");
const users = require("./routes/users")
const product = require("./routes/product")
// mount the specified middleware function(s) at the path which is being specified.
//this is the router middleware
app.use('/api/v1', home);
app.use('/api/v1/', users);
app.use('/api/v1/', product);
// app.use = ("/api/v1", user)

app.get('/signuptest',(req, res) =>{
    res.render("signup")
})
module.exports = app;
//export app js 