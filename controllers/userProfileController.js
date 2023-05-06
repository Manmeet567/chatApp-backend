const User = require('../models/userModel')
const discord = require('discord.js')
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

    if(friends && friends.length === 0) {
        res.status(200).json([]);
    }
    else{
        try{
            const users = await User.find({_id: {$in: friends}});
        
            res.status(200).json(users)
        }
        catch(error){
            res.status(400).json({error:error})
        }
    }

}

// get pending Friend List
const getPendingUsers = async (req,res) => {
    const {pending} = req.body;
    if(pending && pending.length === 0) {
        res.status(200).json([]);
    }
    else{
        try{
            const users = await User.find({_id: {$in: pending}});

            res.status(200).json(users)
        }
        catch(error){
            console.log(error)
            res.status(400).json({error:error})
        }
    }
}


// get blocked users
const getBlockedUsers = async (req,res) => {
    const {blocked} = req.body;
    if(blocked && blocked.length === 0){
        res.status(200).json([]);
    }
    else{
        try{
            const users = await User.find({_id: {$in: blocked}});

            res.status(200).json(users)
        }
        catch(error){
            console.log(error)
            res.status(400).json({error:error})
        }
    }
}


// send friend request
const addFriendRequest = async (req, res) => {
  const senderId = req.user._id;
  const requestedUser = req.body.uniqueUsername;

  try {
    const receiver = await User.findOne({ uniqueUsername: requestedUser });

    if (!receiver) {
      return res.status(200).json({ sent: false, message: 'User does not exist.' });
    }

    const updatedReceiver = await User.findByIdAndUpdate(
      receiver._id,
      { $push: { pending: { user_id: senderId } } }
    );

    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      { $push: { pending: { receiver: requestedUser, user_id: receiver._id } } },
      { new: true }
    );

    return res.status(200).json({ sent: true, requestData: updatedSender.pending});
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
};


module.exports = {
    updateStatus,
    getFriends,
    getPendingUsers,
    getBlockedUsers,
    addFriendRequest
}