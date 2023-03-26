const { json } = require("express");
const BigPromise = require("../middlewares/bigPromise");
const Product = require('../models//product')
const CustomError = require("../utils/customErrors")
const cloudinary = require("cloudinary");

exports.addProduct = BigPromise(async (req, res, next) => {
    //images
    let imageArray = []

    if(!req.files){
        return next(new CustomError("please choose images", 401))
    }

    if(req.files){
        for (let i = 0 ; i < req.files.photos.length;  i++){
            let result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilesPath, {
                folder: "products"
            })

            imageArray.push({
                id: res.public_id,
                secure_url : result.secure_url,
            })
        }
    }

    req.body.photos = imageArray
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.send(200).json({
        success: true,
        product, 
    })


})