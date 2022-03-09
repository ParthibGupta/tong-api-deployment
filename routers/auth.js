const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth');

router.post('/login', auth_controller.login_user);
router.post('/register', auth_controller.register_user);
router.post('/register-and-create-store', auth_controller.register_and_create_store);

module.exports = router;