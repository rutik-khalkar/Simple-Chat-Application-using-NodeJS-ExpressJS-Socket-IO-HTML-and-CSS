const mongoose = require('mongoose');
const  MONGO_URL = 'mongodb://localhost/ChatApplication'
// create database connection and export
exports.connect = () =>{
    
    mongoose.connect(MONGO_URL, {
        useNewUrlParser    : true,
        useUnifiedTopology : true
    })

    .then(() => {
        console.log("Database connected successfully...!");
    })
    .catch((error) => {
    console.log("Database connection failed!");
    console.error(error);
    process.exit(1);
    });
}
