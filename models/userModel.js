const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const Server = require('./serverModel')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true
    },
    uniqueNameCounter:{
        type:Number,
        required:true
    },
    uniqueUsername:{
        type:String,
        unique:true,
        required:true
    },
    status:{
        type:String,
        default:'invisible'
    },
    customStatus:{
        type:String,
        default:null
    },
    avatar:{
        type:String,
        default:null
    },
    friends:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    pending:[
        {
            receiver:{
                type:Boolean,
                required:true
            },
            user_id:{
                type:Schema.Types.ObjectId,
                required:true
            }
        }
    ],
    blocked:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    serverList:[
        {
            type:Schema.Types.ObjectId,
            ref:'Server'
        }
    ]
}, {timestamps:true});



// static signup method
userSchema.statics.signup = async function(email,password,username){

    // validation
    if(!email || !password || !username) {
        throw Error('All fields must be filled');
    }

    if(!validator.isEmail(email)){
        throw Error('Enter a valid Email');
    }

    const emailExists = await this.findOne({email})
    if(emailExists){
        throw Error('Email already in Use')
    }

    // const usernameExists = await this.findOne({username})
    
    const usernameExists = await this.findOne({username}).sort({createdAt: -1})
    console.log(usernameExists)

    let uniqueNumber = 0;

    if(!usernameExists){
    
    }
    else if(usernameExists.username === username && usernameExists.uniqueNameCounter < 9999) {
        uniqueNumber = usernameExists.uniqueNameCounter + 1
    }
    else if(usernameExists.username === username && usernameExists.uniqueNameCounter === 9999){
        throw Error("Username is already in use")
    }
    else{
        uniqueNumber = 1
    }
    

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);
    let paddedNum = uniqueNumber.toString().padStart(4,"0")
    let uniqueUsername = `${username}#${paddedNum}`;


    const user = await this.create({email,password:hash,username,uniqueNameCounter:uniqueNumber,uniqueUsername})

    uniqueUsername = '';

    return user

    //i got this code and i removed unique property from username in the schema, but i am still getting this error "E11000 duplicate key error collection: Miscord.users index: username_1 dup key: { username: "Hiro" }" can you modify this code and correct it?
}

// login User
userSchema.statics.login = async function(email,password) {

    // validation
    if(!email || !password) {
        throw Error('All fields must be filled');
    }

    if(!validator.isEmail(email)){
        throw Error('Enter a valid Email');
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error('User does not exist')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error('Incorrect Password');
    }

    return user

}

const User = mongoose.model('User', userSchema);
module.exports = User;