const User = require('../models/userModel')
const { io } = require('../socket/socket')

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

    let pendingRequests = 0;
    if (receiver.notifications.pendingRequests) {
      pendingRequests = receiver.notifications.pendingRequests;
    }

    const updateQuery = {
      $push: { pending: { receiver: requestedUser, user_id: senderId } },
      $set: { 'notifications.pendingRequests': pendingRequests + 1 }
    };
    
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    const updatedReceiver = await User.findByIdAndUpdate(receiver._id, updateQuery, options);

    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      { $push: { pending: { receiver: requestedUser, user_id: receiver._id } } },
      { new: true }
    );

    if(updatedReceiver.socketId){
        const notification = updatedReceiver.notifications
        console.log(notification)
        req.app.get('io').to(updatedReceiver.socketId).emit('incomingFriendRequest', notification);
    }

    return res.status(200).json({ sent: true, requestData: updatedSender.pending, newFriend: updatedReceiver });
  } catch (error) {
    console.log(error)
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