const mongoose = require("mongoose");

const category_schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        min: 1
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId, 
        default: null
    }
}, { timestamps: true });




module.exports = mongoose.model('Category', category_schema);