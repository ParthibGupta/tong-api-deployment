const express = require('express');
const router = express.Router();
const verify = require('../helpers/verify_token');

const review_controller = require('../controllers/review');

router.post('/create', verify, review_controller.create_review);

module.exports = router;