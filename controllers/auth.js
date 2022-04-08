const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Both for store owners and shoppers
exports.login_user = async (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'Missing credentials'});
    }
    
    //User existence check
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(403).json({ message: "Email or password is incorrect" });
    
    //Password Match
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(403).json({message: 'Password is incorrect'});
    
    
    //Logging in
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);


    return res.status(200).json({
        message: "Logged in successfully",
        token,
        user
    });

}

// Only when shoppers register at a partical store
exports.register_user =  async (req, res) => {

    if(!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
        return res.status(400).json({message: 'Missing credentials'});
    }

    //Duplicate User Check
    const does_user_exist = await User.findOne({ email: req.body.email });
    if(does_user_exist) return res.status(400).json({message: "User already registered"});

    //Hashing
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashed_password,
    });

    try {
        const savedUser = await user.save();
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
        return res.status(200).json({message: "Successfully registered", token, user: savedUser });
    } catch(err) {
        return res.status(400).json({message: err});
    }
}

exports.register_and_create_store = async (req, res) => {
        if(!req.body.userData.email || !req.body.userData.password || !req.body.userData.firstName || !req.body.userData.lastName) {
            return res.status(400).json({message: 'Missing credentials'});
        }

        const { storeData, userData } = req.body; 

        // Duplicate User Check
        const does_user_exist = await User.findOne({ email: userData.email });
        if(does_user_exist) return res.status(400).json({message: "User already registered, please login first"});
    
        // Hashing
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(userData.password, salt);
    
        // Create user
        const user = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashed_password,
        });
    
        try {
            const product = new Product({
                name: storeData.product.productName,
                sku: '',
                description: storeData.product.productDescription,
                price: Number(storeData.product.productPrice),
                images: [storeData.product.productPicture],
                categories: [],
                stockCount: 0,
                stockCountOption: 'none',
                priceOption: 'product',
                isActive: true,
                hasVariations: false,
                discounts: [],
                variations: [],
                options: []
            });

            // After registering user, create the store
            const store = new Store({
                name: storeData.name,
                contactEmail: storeData.contactEmail,
                description: storeData.description,
                deliveryCharge: Number(storeData.deliveryCharge),
                promoCodes: storeData.promoCodes,
                discounts: [],
                creator: user._id,
                socials: storeData.socials,
                contracts: storeData.contracts,
                address: storeData.address,
                returnPolicy: storeData.returnPolicy,
                displayPhoto: storeData.displayPhoto,
                coverPhoto: storeData.coverPhoto,
                paymentMethods: {
                    bkash: { 
                        number: storeData.bkashNumber,
                        enabled: storeData.bkashEnabled
                    },
                    cashOnDelivery: storeData.cashOnDelivery
                }
            });

            // Link product to store and save
            product.storeId = store._id;
            await product.save();

            // Link store to product and save
            // store.products.push(product._id);
            const saved_store = await store.save();

            // Assign store id to owner user
            user.storeId = saved_store._id;
            const saved_user = await user.save();

            const token = jwt.sign({_id: saved_user._id}, process.env.TOKEN_SECRET);
            return res.status(200).json({message: "Successfully registered", token, user: saved_user });
        } catch(err) {
            return res.status(400).json({message: err.message });
        }
}