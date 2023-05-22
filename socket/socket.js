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

// socket authorization middleware
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

    // Attach the user object to the socket for future reference
    socket.user = user;

    next();
  } catch (error) {
    console.log(error);
    next(new Error('Request is not authorized'));
  }
});


// socket connection handler
io.on('connection', (socket) => {
  console.log('Client Connected : ',socket.id);

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log('Client Disconnected : ', socket.id);
    });
  });
};

module.exports = {
    initializeSocket,
    io
};