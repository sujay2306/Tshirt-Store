const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customErrors");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary")
//Signup
exports.signUp = BigPromise(async (req, res, next ) => {
        // image upload
    let result
    if(req.files){
        let files = req.files.photo
        result = await cloudinary.v2.uploader.upload(files, {
            folder: users,
            width: 150,
            crop: scale,
        })
    }
    //username and password
    const {name, email, password} = req.body;

    if (!email || !name || !password){
        return next(new CustomError("name, mail and password are required", 400));
    }
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
        return next (new CustomError("Please provide mail and password", 400))
     }

     //match user passwoprd and name in db  in user model select is false so defining with select
    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next (new CustomError("user not found please signup", 400))
    }
    //match password
    const isPasswordCorrect =  await user.isValidatedPassword(password)

    if (!isPasswordCorrect){
        return next (new CustomError("email or password is incorrect", 400))
    }
    //if all goes good generate token
    cookieToken(user, res)



}) 