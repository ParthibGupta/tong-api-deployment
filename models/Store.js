const mongoose = require("mongoose");
const Product = require("./Product");

const store_schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        min: 1
    },
    contactEmail: {
        type: String,
        required: true, 
        max: 6
    },
    description: {
        type: String, 
        required: true,
    },

    deliveryCharge: {
        type: Number,
        required: true
    },

    promoCodes: {
        type: [String],
        required: false
    },

    discounts: {
        type: [Number], 
        required: true
    },

    //["fb.com/something", "insta.com/something", "twitter", "youtube"]
    socials: {
        type: [String],
        required: true
    },
    paymentMethods: {
        type: {
            bkash: {
                number: String,
                enabled: Boolean
            },
            cashOnDelivery: Boolean
        },
        required: true
    },
    //[phone, whatsapp, viber]
    contacts: {
        type: {
            messenger: {
                enabled: Boolean,
                link: String
            },
            telegram: {
                enabled: Boolean,
                link: String
            },
            whatsapp: {
                enabled: Boolean,
                link: String
            },
            viber: {
                enabled: Boolean,
                link: String
            },
            phone: {
                enabled: Boolean,
                link: String
            }
        },
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    returnPolicy: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: false
    },
    displayPhoto: {
        type: String,
        required: true
    },
    // coverPhoto: {
    //     type: String,
    //     required: true
    // },
    creator :{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

});




module.exports = mongoose.model('Store', store_schema);