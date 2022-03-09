const express = require('express');
const router = express.Router();
const verify = require('../helpers/verify_token');

const store_controller = require('../controllers/store');
const product_controller = require('../controllers/product');

router.post('/getStore', store_controller.get_store_everything);
router.get('/getProducts', store_controller.get_store_products)
// router.post('/create', verify, store_controller.create_store);
router.post('/updateStore', verify, store_controller.update_store);


module.exports = router;

