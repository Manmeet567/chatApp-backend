const User = require('../models/userModel')
const mongoose = require('mongoose')

// update status
const updateStatus = async (req, res) => {
    const user_id = req.user._id
    const {status} = req.body;
    try{
        const updatedUserStatus = await User.findByIdAndUpdate(user_id, {status}, {new:true});

        res.status(200).json({updatedUserStatus})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

const getFriends = async (req,res) => {
    const {friends} = req.body;

    try{
        const users = await User.find({_id: {$in: friends}});
        
        res.status(200).json(users)
    }catch(error){
        res.status(400).json({error:error})
    }

}



module.exports = {
    updateStatus,
    getFriends
}