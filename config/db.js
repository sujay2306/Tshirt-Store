const mongoose = require("mongoose");

const connectDataBase = () => {

    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("DB connection successful"))
    .catch(
        error => {
            console.log("DB  connection issue");
            console.log(error);
            process.exit(1)
        }
    )
}




module.exports = connectDataBase