const mongoose = require('mongoose')
const validator = require('validator')
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

})



// #convert schema to model
module.exports = mongoose.model("User", userSchema)