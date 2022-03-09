const mongoose = require("mongoose");

const variation = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    }
})

const product_schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        min: 1
    },
    storeId: {
        type: String, 
        default: null
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String], 
        default: []
    },
    categoryIds: {
        type: [String], 
        required: true,
    },
    isActive : {
        type: Boolean,
        required: true
    },
    hasVariations : {
        type: Boolean,
        required: false
    },
    discounts: {
        type: [Number], 
        required: true
    },
    variations: {
        type: [variation],
        required: false
    }

}, { timestamps: true });




module.exports = mongoose.model('Product', product_schema);