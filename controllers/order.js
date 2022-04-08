const Order = require('../models/Order');
const Store = require('../models/Store');

exports.create_order = async (req, res) => {

    const store = await Store.findOne({_id: req.body.storeId });

    if(!store) {
        res.json({message: "Store doesn't exist"});
        return;
    }

    const order = new Order({
        userId: req.body.userId,
        storeId: req.body.storeId,
        shippingInfo: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
        },
        orderStatus: 'processing',
        notes: '',
        cart: req.body.cart,
        paymentType: {
            name: req.body.paymentMethod,
            transactionId: req.body.bkashTransactionId
        }
    });

    order.save()
    .then(data => {
        // res.status(200).json(data);
        res.status(200).json({ order: data });  
    })
    .catch(error => {
        console.log(error.message)
        res.status(500).json({ message: error.message});
    })   

}

exports.update_order = async (req, res) => {
    const id = req.body.orderId;
    const order = await Order.findOne({_id: id});

    if(!order){
        res.json({message: "Order not found"});
        return;
    }

    //Check if req is coming from store owner
    if(order.storeId == req.user.storeId){
        const updates = req.body.updates;

        Order.updateOne(
            {_id: id},
            {$set: updates}
        )
        .then((data) =>{
            res.json({message: "Order has been updated successfully", order: data});
        })
        .catch((error) => {
            res.status(500).json(error);
        })
    }
    else{
        res.json({message: "Owner mismatch"})
    }
}

// exports.retrieve_orders = async (req, res) => {

//     try {
//     const store = await Store.findOne({_id: storeId });

//     if(!store) {
//         res.json({message: "Store doesn't exist"});
//         return;
//     }

//     if(!store.creator.equals(req.user._id)){
//         res.json({message: "Owner mismatch"});
//         return;
//     }
//         const orders = await Order.find({ storeId: storeId});
//         res.status(200).json({ orders })

//     } catch(error) {
//         res.status(500).json({
//             message: error.message
//         })

//     }
 

// }