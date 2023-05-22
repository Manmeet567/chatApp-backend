const User = require('../models/userModel')

const newConnection = async (req,res) => {
    const socketId = req.body.socketId;
  try {
    const userId = req.user._id;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { socketId } },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({ message: 'Socket ID stored successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
    newConnection
}