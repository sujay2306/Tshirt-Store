const { json } = require("express");
const BigPriomise = require("../middlewares/bigPromise")


exports.testProduct = BigPriomise (async(req, res) => {

        res.status(200).json({
            success: "true", 
            greeting: "Hello there From api "
        });
    });
    