const socketIO = require('socket.io')
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

io.use(async (socket, next) => {
   const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication token required'));
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id }).select('_id');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.log(error);
    next(new Error('Request is not authorized'));
  }
});


io.on('connection', (socket) => {
  console.log('Client Connected : ',socket.id);

  socket.on('friendRequestNotification', (data) => {
    if(data.receiver.socketId){
      io.to(data.receiver.socketId).emit("newFriendRequest", data, {once:true})
    }
  })

    socket.on('disconnect',async () => {
      console.log('Client Disconnected : ', socket.id);
      if (socket.user) {
        const userId = socket.user._id;

        try {
          await User.findByIdAndUpdate(userId, { socketId: null });
          console.log('SocketId updated to null in database');
        } catch (error) {
          console.log('Error updating socketId in database:', error);
        }
      }
    });
  });
};

module.exports = {
    initializeSocket,
    io
};