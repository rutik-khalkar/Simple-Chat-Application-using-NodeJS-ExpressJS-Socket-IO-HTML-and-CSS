const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            // required : true
        },
        username: {
            type: String,
            required : true
        },
        room: {
            type: String,
            required: true
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("User", usersSchema)