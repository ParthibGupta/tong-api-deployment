const Store = require('../models/Store');
const Category = require('../models/Category')

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
        const categoryId = data._id;
        Store.updateOne(
            {"_id": storeId },
            {"$push": {categories: categoryId} }
        )
        .then(() => {
            res.status(200).json({ message:'New category created!', category: data });
        })
        .catch(error => {
            res.status(500).json(error);
        })   
    })
    .catch(error => {
        res.status(500).json(error);
    })   

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

    try {
        await Category.findByIdAndDelete(categoryId)
        res.status(200).json({ message:`Category ${categoryId} has been deleted`});
    } catch(error) {
        res.status(500).json(error);
    }
}