const express = require('express');
const router = express.Router();
const verify = require('../helpers/verify_token');

const product_controller = require('../controllers/product');

router.get('/ProductById', product_controller.get_product_by_id);
router.post('/add', verify, product_controller.create_product);
router.post('/update', verify, product_controller.update_product_by_id);
router.delete('/delete', verify, product_controller.delete_product_by_id);

module.exports = router;