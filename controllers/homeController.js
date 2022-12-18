const { json } = require("express");
const BigPriomise = require("../middlewares/bigPromise")

exports.home = BigPriomise (async(req, res) => {

    res.status(200).json({
        success: "true", 
        greeting: "Hello there From api "
    });
});

exports.dummy = BigPriomise (async(req, res) => {

    res.status(200).json({
        success: "true", 
        greeting: "Hello there From dummy api "
    });
});