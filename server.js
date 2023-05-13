const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors');
const { initializeSocket } = require('./socket/socket');


const userRoutes = require('./routes/users');
const userProfileRoutes = require('./routes/userProfileRoutes');
const serverRoutes = require('./routes/serverRoutes')


const app = express();
const server = require('http').createServer(app);

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODBURI;

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use('/api/user',userRoutes)
app.use('/api/server', serverRoutes)
app.use('/api/userProfile', userProfileRoutes)


// socket.io
initializeSocket(server)

server.listen(8900,() => {
   console.log('Socket.io connected at 8900')
})

// connecting to database
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI)
 .then(() => {
    app.listen(PORT, () => {
        console.log('Connected to mongodb and listening on PORT:'+PORT);
    })
 })
 .catch((err) => {
    console.log(err)
 })

