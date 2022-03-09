const Store = require('../models/Store');
const Product = require('../models/Product')

exports.create_product = async (req, res) => {

    const store = await Store.findOne({_id: req.body.store});

    if(!store){
        res.json({message: "Store doesn't exist"});
        return;
    }
    
    if(!store.creator.equals(req.user._id)){
        res.json({message: "Owner mismatch"});
        return;
    }
    const product = new Product({
        name: req.body.name,
        store: req.body.store,
        description: req.body.description,
        price: req.body.price,
        created_at: req.body.created_at,
        images: req.body.images,
        categoryIds: req.body.categoryIds,
        isActive: req.body.isActive,
        hasVariations: req.body.hasVariations,
        discounts: req.body.discounts,

    });

    product.save()
    .then(data => {
        // res.status(200).json(data);
        const store = req.body.store;
        const product_id = data._id;
        Store.updateOne(
            {"_id": store},
            {"$push": {products: product_id} }
        )
        .then(() => {
            res.json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        })   
    })
    .catch(error => {
        res.status(500).json(error);
    })   

}

exports.get_product_by_id = async (req, res) => {

    const id = req.body.product_id;
    const product = await Product.find({_id: id});

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(product);
}

exports.update_product_by_id = async (req, res) => {
    const id = req.body.product_id;
    const product = await Product.findOne({_id: id});

    //Product Validation
    if(!product){
        res.json({message: "Product not found"});
        return;
    }
    const store = await Store.findOne({_id: product.store});

    //Check if req is coming from store owner
    if(store.creator.equals(req.user._id)){
        const changes = req.body.changes;

        Product.updateOne(
            {_id: id},
            {$set: changes}
        )
        .then((data) =>{
            res.json({message: "processed", data});
        })
        .catch((error) => {
            res.status(500).json(error);
        })
    }
    else{
        res.json({message: "Owner mismatch"})
    }
    
}

exports.delete_product_by_id = async (req, res) => {
    const id = req.body.product_id;
    const product = await Product.findOne({_id: id});

    //Product Validation
    if(!product){
        res.json({message: "Product not found"});
        return;
    }
    const store = await Store.findOne({_id: product.store});

    //Check if req is coming from store owner
    if(store.creator.equals(req.user._id)){

        Product.deleteOne(
            {_id: id}
        )
        .then((data) =>{
            res.send({message: "processed", data});
        })
        .catch((error) => {
            res.status(500).json(error);
        })
    }
    else{
        res.json({message: "Owner mismatch"})
    }
    
}