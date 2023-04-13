const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors');


const userRoutes = require('./routes/users');
const serverRoutes = require('./routes/serverRoutes')


const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODBURI;

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use('/api/user',userRoutes)
app.use('/api/server', serverRoutes)



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

