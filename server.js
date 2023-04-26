const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors');
const discord = require('discord.js')


const userRoutes = require('./routes/users');
const userProfileRoutes = require('./routes/userProfileRoutes');
const serverRoutes = require('./routes/serverRoutes')


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(8900, {
   cors:{
      origin:'http://localhost:5173'
   }
});
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
io.on('connection', (socket)=>{
   console.log('a user connected');

   socket.emit('hello', "Heelo World");
})


const channelId = discord.SnowflakeUtil.generate();
console.log(channelId);


// connecting to database
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI)
 .then(() => {
    server.listen(PORT, () => {
        console.log('Connected to mongodb and listening on PORT:'+PORT);
    })
 })
 .catch((err) => {
    console.log(err)
 })

