// const User = require("..models/user");
const BigPromise = require("../middlewares/bigPromise");

exports.signUp = BigPromise(async (req, res, next ) => {
    res.send("signup route");
});