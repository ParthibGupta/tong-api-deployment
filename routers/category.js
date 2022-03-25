const express = require('express');
const router = express.Router();
const verify = require('../helpers/verify_token');

const category_controller = require('../controllers/category');

router.post('/add', verify, category_controller.create_category);
router.post('/delete', verify, category_controller.delete_category);

module.exports = router;