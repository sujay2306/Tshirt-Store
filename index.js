const app = require("./app");
const connectDataBase = require("./config/db");
require('dotenv').config();
const cloudinary = require("cloudinary")

//connect with DB
connectDataBase()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET,
})

app.listen(process.env.PORT, () => {
console.log(`Server is running at ${process.env.PORT}`);

});