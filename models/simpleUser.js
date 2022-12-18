const mongoose = require('mongoose');
const validator = require('validator');
const becypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlenght: [40, "Name should be under 40 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: [validator.isEmail, 'Please enter the email in correct format'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Please provide a password with min of 6 characters"],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now

    }
});


//Encrypt password before saving using "pre-Hook"
// but the challange is when ever we modify any other field this pre-hook will be executed for that repeatedly
//we will be using isModified()
// https://stackoverflow.com/questions/40161459/user-ismodified-is-not-a-function-when-doing-a-pre-update-in-mongoose

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await becypt.hash(this.password, 10);
})

//Validate the password with passedon user password 
userSchema.methods.IsvalidatedPassword = async function(userPassword){ 
    return await bcrypt.compare(userPassword, this.password) //this is a true or false event
}

// #convert schema to model
module.exports = mongoose.model("User", userSchema);