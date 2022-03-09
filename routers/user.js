const express = require('express');
const router = express.Router();
const verify = require('../helpers/verify_token')
const user_controller = require('../controllers/user');

router.get('/details', verify, user_controller.find_user_by_id);
// router.post('/details', verify, user_controller.update_user_details);

module.exports = router;