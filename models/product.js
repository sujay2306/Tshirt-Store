const mongoose = require("mongoose")
const productSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "provide prouct name"],
        trim: true, //used to remove extra space
        maxlength: [120, "should not exceed 120 characters"]
    },

    price:{
        type: String,
        required: [true, "provide prouct price"],
        trim: true, //used to remove extra space
        maxlength: [5, "should not exceed 5 digits"]
    },

    description:{
        type: String,
        required: [true, "provide prouct description"],
       
    },

    photos:[
        { 
            id:{
            type: String,
            required: true,
        },
        secure_url:{
            type: String,
            required: true,
        }
    }],


    category:{
        type: String,
        required: [true, "provide select category from- short-sleevs, long-sleevs, sweat-shirts, hoodies"],
        enum: {
            values: [
                "shortsleves",
                "longsleevs",
                "sweatshirts",
                "hoodies"
            ],
            message: "Please provide category ONLY from- short-sleevs, long-sleevs, sweat-shirts and hoodies "
        },
    },

    brand: {
        type: String,
        required: [true, "please add a brand for clothing"],
    },
     
    ratings: {
        type: Number,
        default: 0,
    },

    numberOfReviews: {
        type: Number,
        default: 0,
    },

    reviews: [{
        user:{
            type: mongoose.Schema.ObjectId,  // user object it can come from user so we are using refs
            ref: "User", //coming up from user or product or some sources where obj is coming from 
            required: true
        },

        name:{
            type: String,  
            required: true
        },

        rating:{
            type: Number, 
            required: true
        },
        comment:{
            type: String,  
            required: true
        },
    }],

    user : {
        type: mongoose.Schema.ObjectId,
        ref: "User", 
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now,
    }
})



module.exports = mongoose.model('Product', productSchema)