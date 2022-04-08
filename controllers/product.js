const Store = require('../models/Store');
const Product = require('../models/Product')

exports.create_product = async (req, res) => {

    const { storeId, productData } = req.body 

    const store = await Store.findOne({_id: storeId });

    if(!store){
        res.json({message: "Store doesn't exist"});
        return;
    }
    
    if(!store.creator.equals(req.user._id)){
        res.json({message: "Owner mismatch"});
        return;
    }

    const product = new Product({
        name: productData.name,
        sku: productData.sku,
        storeId: storeId,
        description: productData.description,
        price: productData.price,
        images: productData.images,
        categories: productData.categories,
        isActive: productData.isActive,
        hasVariations: productData.hasVariations,
        discounts: [],
        stockCount: productData.stockCount,
        stockCountOption: productData.stockCountOption,
        priceOption: productData.priceOption,
        variations: productData.variations,
        options: productData.options
    });

    product.save()
    .then(data => {
        // res.status(200).json(data);
        res.status(200).json({ proudct: data });  
    })
    .catch(error => {
        console.log(error.message)
        res.status(500).json({ message: error.message});
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
    //Check if req is coming from store owner
    if(product.storeId == req.user.storeId){
        const updates = req.body.updates;

        Product.updateOne(
            {_id: id},
            {$set: updates}
        )
        .then((data) =>{
            res.json({message: "Product has been updated successfully", product: data});
        })
        .catch((error) => {
            res.status(500).json(error);
        })
    }
    else{
        res.json({message: "Owner mismatch"})
    }
    
}

exports.delete_product = async (req, res) => { 
    const { productId, storeId } = req.body
    const store = await Store.findById({_id: storeId });

    if(!store){
        res.json({message: "Store doesn't exist"});
        return;
    }
    
    if(!store.creator.equals(req.user._id)){
        res.json({message: "Owner mismatch"});
        return;
    }

    try {
        await Product.findByIdAndDelete(productId)
        res.status(200).json({ message:`Product ${productId} has been deleted`});
    } catch(error) {
        res.status(500).json(error);
    }
}
