const mongoose = require("mongoose");

const order_schema = new mongoose.Schema({
    userId: {
        type: String,
        default: ''
    },
    storeId: {
        type: String,
        required: true
    },
    shippingInfo: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        emailAddress: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        apartment: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        }
    },
    orderStatus: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    cart: {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            storeId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            hasVariations: {
                type: Boolean,
                required: true
            },
            displayPhoto: {
                type: String,
                default: ''
            },
            slug: {
                type: String,
                default: ''
            }
        }],
        required: true
    },
    paymentType: {
        type: {
            name: String,
            transactionId: String
        },
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', order_schema);