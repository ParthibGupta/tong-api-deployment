const Store = require('../models/Store');
const Product = require('../models/Product')
const Review = require('../models/Review');
const Order = require('../models/Order');

exports.create_review = async (req, res) => {

    const { storeId, productId, reviewData } = req.body 

    const store = await Store.findOne({_id: storeId });

    if(!store){
        res.json({message: "Store doesn't exist"});
        return;
    }

    if(store.creator.equals(req.user._id)){
        const review = new Review({ 
            storeId: storeId,
            productId: productId,
            rating: reviewData.rating,
            username: req.user.firstName + ' ' + req.user.lastName,
            user: req.user._id,
            content: reviewData.content
        });
    
        review.save()
        .then(data => {
            // res.status(200).json(data);
            res.status(200).json({ message: 'Review posted successfully', review: data });  
        })
        .catch(error => {
            console.log(error.message)
            res.status(500).json({ message: error.message});
        })  
    } else {
        let did_user_purchase_product = false;
        const orders = await Order.find({ userId: req.user._id });

        if(orders.length < 0) {
            did_user_purchase_product = false;
        } else {
            orders.forEach((order) => {
                order.cart.forEach((productOrdered) => {
                    if(productOrdered.productId == productId) 
                        did_user_purchase_product = true
                })
            })
        }

        if(did_user_purchase_product) {
            const review = new Review({
                storeId: storeId,
                productId: productId,
                rating: reviewData.rating,
                user: req.user._id,
                content: reviewData.content
            });
        
            review.save()
            .then(data => {
                // res.status(200).json(data);
                res.status(200).json({ message: 'Review posted successfully', review: data });  
            })
            .catch(error => {
                console.log(error.message)
                res.status(500).json({ message: error.message});
            })  
        } else {
            res.status(400).json({ message: 'User not authorized to post review' });  
        }

    }

}