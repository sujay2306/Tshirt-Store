const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customErrors");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary");
const { json } = require("express");
const user = require("../models/user");
const mailHelper = require("../utils/emailHelper");


//Signup
exports.signUp = BigPromise(async (req, res, next ) => {
        // image upload
    if(!req.files){
        return next(new CustomError("photo is required for signup", 400));
    }
        //username and password
    const {name, email, password} = req.body;
    if (!email || !name || !password){
        return next(new CustomError("name, mail and password are required", 400));
    }
    
    let files = req.files.photo
    const result = await cloudinary.v2.uploader.upload(files.tempFilePath, { //use tempfile or else error
            folder: "users",
            width: 150,
            crop: "scale",
     })
    

    //create user in DB
   const user = await User.create({
        name,
        email,
        password,
        photo: {
            id:  result.public_id,
            secure_url: result.secure_url
        } // cloudinary photo
    });
    // #send a cookie token
    cookieToken(user, res)
});

//Login 
exports.login = BigPromise(async(req, res, next) => {
    const {email,name,password} = req.body
     //check presence of mail and password
     if(!email || !password){
        return next (new CustomError("Please provide mail and password", 400));
     }

     //match user passwoprd and name in db  in user model select is false so defining with select
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next (new CustomError("user not found please signup", 400));
    }
    //match password
    const isPasswordCorrect =  await user.isValidatedPassword(password);

    if (!isPasswordCorrect){
        return next (new CustomError("email or password is incorrect", 400))
    }
    //if all goes good generate token
    cookieToken(user, res);



});

//Logout
exports.logout = BigPromise(async (req, res, next) => {
	  //clear the cookie	
      res.cookie("token", null, {	
        expires: new Date(Date.now()),	
        httpOnly: true,	
      });	
      //send JSON response for success	
      res.status(200).json({	
        succes: true,	
        message: "Logout success",	
      });	
    });


exports.forgotPassword = BigPromise(async (req, res, next) => {
        // collect email
    const { email } = req.body;
      
        // find user in database
        const user = await User.findOne({ email });
      
        // if user not found in database
        if (!user) {
          return next(new CustomError("Email not found as registered", 400));
        }
      
        //get token from user model methods
        const forgotToken = user.getForgotPasswordToken();
      
        // save user fields in DB
        await user.save({ validateBeforeSave: false });
      
        // create a URL
        const myUrl = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/password/reset/${forgotToken}`;
      
        // craft a message
        const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
      
        // attempt to send email
        try {
          await mailHelper({
            email: user.email,
            subject: "TStore - Password reset email",
            message,
          });
      
          // json reponse if email is success
          res.status(200).json({
            succes: true,
            message: "Email sent successfully",
          });
        } catch (error) {
        //   reset user fields if things goes wrong
          user.forgotPasswordToken = undefined;
          user.forgotPasswordExpiry = undefined;
          await user.save({ validateBeforeSave: false });
      
          // send error response
          return next(new CustomError(error.message, 500));
        }
});
      