const Store = require('../models/Store');
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.create_category = async (req, res) => {
    const { category, storeId } = req.body


    const store = await Store.findById({_id: storeId });

    if(!store){
        res.json({message: "Store doesn't exist"});
        return;
    }
    
    if(!store.creator.equals(req.user._id)){
        res.json({message: "Owner mismatch"});
        return;
    }

    const newCategory = new Category({
        name: category.name,
        storeId: storeId
    })

    newCategory.save()
    .then(data => {
        // res.status(200).json(data);
        // const categoryId = data._id;
        res.status(200).json({ message:'New category created!', category: data });

        // Store.updateOne(
        //     {"_id": storeId },
        //     {"$push": {categories: categoryId} }
        // )
        // .then(() => {
        //     res.status(200).json({ message:'New category created!', category: data });
        // })
        // .catch(error => {
        //     res.status(500).json(error);
        // })   
    })
    .catch(error => {
        res.status(500).json(error);
    })   

}

exports.update_product_by_id = async (req, res) => {
    const id = req.body.categoryId;
    const category = await Category.findOne({_id: id});

    //Product Validation
    if(!category){
        res.json({message: "Category not found"});
        return;
    }
    console.log(req.user.storeId);
    console.log(category.storeId);
    //Check if req is coming from store owner
    if(category.storeId.equals(req.user.storeId)){
        const updates = req.body.updates;
        console.log(updates)
        Category.updateOne(
            {_id: id},
            {$set: updates}
        )
        .then((data) =>{
            res.json({message: "Category has been updated successfully", category: data});
        })
        .catch((error) => {
            res.status(500).json(error);
        })
    }
    else{
        res.json({message: "Owner mismatch"})
    }
    
}

exports.delete_category = async (req, res) => { 
    const { categoryId, storeId } = req.body
    const store = await Store.findById({_id: storeId });

    if(!store){
        res.json({message: "Store doesn't exist"});
        return;
    }
    
    if(!store.creator.equals(req.user._id)){
        res.json({message: "Owner mismatch"});
        return;
    }

        Product.updateMany({ category: categoryId }, {category: ''})
        .then(async (data) =>{
            try {

            await Category.findByIdAndDelete(categoryId)
            res.status(200).json({ message:`Category ${categoryId} has been deleted`});

    } catch(error) {
        res.status(500).json(error);
    }
        })
        .catch((error) => {
            res.status(500).json(error);
        })
}