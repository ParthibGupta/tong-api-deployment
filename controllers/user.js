const User = require('../models/User');


exports.find_user_by_id = async (req, res) => {
    const user = await User.findById({_id: req.user._id}, { password: 0 })
    res.json({ user });
}

// exports.update_user_details = async (req, res) => {
//     const updates = req.body

//     if(updates.first_name.trim() == '' || updates.last_name.trim() == '' || updates.organization_name.trim() == '') {
//         res.status(400).json({
//             message: 'Input field must not be empty'
//         })

//         return
//     }

//     try {
//         const user = await User.findByIdAndUpdate(req.user._id, {
//             ...updates
//         }, {new: true});
    
//         res.status(200).json({ 
//             message: 'User has been updated successfully!',
//             user
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: error.message
//         })
//     }
// }
