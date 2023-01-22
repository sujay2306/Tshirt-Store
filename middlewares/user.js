const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customErrors");
const jwt = require("jsonwebtoken");
const { json } = require("express");

//ISLOGGEDIN MIDDELWARE
exports.isLoggedIn = BigPromise( async(req, res, next) => {
    const token = req.cookies.token || req.header("Authorzation").replace("Bearer ",""); //space is compulsory after Bearer and replace with nothing this will give us token
   
    if (!token){
        return next (new CustomError("Login firsdt to access this page", 401));
    }
    //decode the token and verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();

})

//roles

exports.customRole = (...roles) => {
    return(req, res, next) => {
        if(! roles.includes(req.user.role)){
            return next(new CustomError("you are not allowed for this resource", 400));
        }
        next();
        

    }

}