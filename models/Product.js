const mongoose = require("mongoose");

const variation = new mongoose.Schema({
    slug: {
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
    },
    stockCount: {
        type: Number,
        required: true
    }
})

const option = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    values: {
        type: [String],
        required: true
    }
})

const product_schema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    sku: {
        type: String,
        default: ''
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
    priceOption: {
        type: String,
        required: true
    },
    stockCount: {
        type: Number,
        required: true
    },
    stockCountOption: {
        type: String,
        required: true
    },
    images: {
        type: [String], 
        default: []
    },
    category: {
        type: String, 
        default: '',
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
    },
    options: {
        type: [option],
        required: false
    }

}, { timestamps: true });




module.exports = mongoose.model('Product', product_schema);