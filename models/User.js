const mongoose = require("mongoose");

//Changed so that user no longer has store array
const user_schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 1
    },
    lastName: {
        type: String,
        required: true,
        min: 1
    },
    email: {
        type: String,
        required: true,
        min: 1
    }, 
    password: {
        type: String,
        required: true,
        min: 1
    },
    storeId :{
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
});

module.exports = mongoose.model('User', user_schema);