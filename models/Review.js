const mongoose = require("mongoose");

const review_schema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId, 
        default: null
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    rating: {
        type: Number, 
        required: true
    },
    username: {
        type: String, 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });




module.exports = mongoose.model('Review', review_schema);