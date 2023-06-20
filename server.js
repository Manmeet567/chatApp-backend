const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { initializeSocket } = require('./socket/socket');

const userRoutes = require('./routes/users');
const userProfileRoutes = require('./routes/userProfileRoutes');
const serverRoutes = require('./routes/serverRoutes');
const socketRoutes = require('./routes/socketRoutes');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODBURI;

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use('/api/user', userRoutes);
app.use('/api/server', serverRoutes);
app.use('/api/userProfile', userProfileRoutes);
app.use('/api/webSocket', socketRoutes);

// socket.io
initializeSocket(server); // Pass the socket.io instance to the initializeSocket function
// Set the 'io' object in the app
app.set('io', io);

// connecting to database
mongoose.set('strictQuery', true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log('Connected to mongodb and listening on PORT:' + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
