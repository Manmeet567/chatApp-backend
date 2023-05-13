const socketIO = require('socket.io')

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
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