const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customErrors");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary");
const { json } = require("express");
const user = require("../models/user");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
const { use } = require("../routes/users");

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

exports.passwordReset = BigPromise(async (req, res, next) => {
    //get token from params
    const token = req.params.token;
    // hash the token as db also stores the hashed version
    const encryToken = crypto.createHash("sha256").update(token).digest("hex");
    //user will bve having this password
    //only care about token wich is is future time
    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry: { $gt: Date.now() },
      });

    if (!user) {
        return next(new CustomError("Token is invalid or expired", 400));
      }
    if (req.body.password !== req.body.confirmPassword) {
        return next(
          new CustomError("password and confirm password do not match", 400)
        );
      }    
      // update password field in DB
      user.password = req.body.password;
      // reset token fields
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
    
      // save the user
      await user.save();
    
    //send token or json here i will send token
    res.status(200).json({
        succes: true,
        message: "successfully changed the password"
    })
    // cookieToken(user, req);

});

//user dashboard
exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id)  //req.user doesnt exists we ahve injected that property
  res.status(200).json({
    succes: true,
    user
  })
})

//update password for a user i.e when you already know the password
exports.changePassword = BigPromise(async (req, res, next) => {
  const userId =  req.user.id;  //req.user doesnt exists we ahve injected that property
  const user  = await User.findById(userId).select("+password");
  //old password fopr old we can use mongoogse model "isvalidated" and new password 
  const isCorrectOldPassword =  await user.isValidatedPassword(req.body.oldPassword);

  if(!isCorrectOldPassword){
    return next(new CustomError("old password is incorrect", 400))
  }
  user.password = req.body.password;
  await user.save();
  cookieToken(user, res);
})