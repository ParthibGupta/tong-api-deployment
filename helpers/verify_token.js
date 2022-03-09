const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = async function auth (req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({message: "Not Authenticated"});

    try {
        const verified = await jwt.decode(token, process.env.TOKEN_SECRET);
        const user = await User.findById(mongoose.Types.ObjectId(verified._id));

        if (!user) {
            return res.status(401).json({
                message:'Invalid Token, user not found',
                token
            });
        } 
        req.user = user;
        next();
    } catch(err) {
        console.log(err.message)
        return res.status(400).send(err.message);
    }
}