const express        = require('express');
const app            = express();
const mongoose       = require('mongoose');
const store_router   = require('../routers/store');
const product_router = require('../routers/product');
const auth_router    = require('../routers/auth');
const user_router    = require('../routers/user');
const category_router    = require('../routers/category');
const order_router   = require('../routers/order');
const cors           = require('cors');

require('dotenv/config');
bodyParser = require('body-parser');

app.use(express.json());
app.use(cors());
    
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses


mongoose.connect(process.env.NODE_ENV !== "test" ? process.env.DB_MAIN_CONNECTION : process.env.DB_TEST_CONNECTION, () => {
    console.log('Connected to Mongo');
});

app.use('/stores', store_router);
app.use('/categories', category_router);
app.use('/products', product_router);
app.use('/orders', order_router);
app.use('/auth', auth_router);
app.use('/users', user_router);

module.exports = app