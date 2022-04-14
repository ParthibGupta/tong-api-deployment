const Store = require('../models/Store');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');

var ObjectId = require('mongodb').ObjectId;


exports.get_store_everything = async (req, res) => {
    const id = req.body.storeId;

    if (ObjectId.isValid(id)) {
        const store = await Store.findById(id);
        const products = await Product.find({storeId: id});
        const categories = await Category.find({storeId: id});
        const orders = await Order.find({ storeId: id});
        const reviews = await Review.find({ storeId: id });
        // console.log({ store: { ...store._doc, products: products } })
        // res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ store: { ...store._doc, products: products, categories: categories, orders: orders, reviews: reviews } });
    } else {
        res.status(400).json({ message: 'Not a valid store id'});
    }
}

exports.get_store_products = async (req, res) => {
    const id = req.body.store_id;
    const products = await Product.find({shop: id});

    // res.setHeader('Content-Type', 'application/json');
    res.status(200).json({products: products});
}

exports.update_store = async (req, res) => {
    const { updates, storeId } = req.body;
    if(req.user.storeId == storeId){
        try {
            await Store.updateOne(
                {_id: storeId},
                {$set: updates}
            );

            const updatedStore = await Store.findById(storeId);

            res.json({ message: "processed", store: updatedStore });
        } catch(error) {
            console.log(error.message)
            res.status(500).json({message: error.message});
        }
    }
    else {
        res.json({message: "You are not authorized to update this store"})
    }
}
