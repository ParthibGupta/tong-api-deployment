const express = require('express');
const router = express.Router();
const verify = require('../helpers/verify_token');

const order_controller = require('../controllers/order');

// router.get('/', verify, order_controller.retrieve_orders);
router.post('/add', order_controller.create_order);
router.post('/update', verify, order_controller.update_order);

module.exports = router;