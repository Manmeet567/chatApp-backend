const Server = require('../models/serverModel');


// create server
const addServer = async (req,res) => {
    const addServerData = req.body;
    const user_id = req.user._id;
    addServerData.creator = user_id

    try {
        const server = await Server.createServer(addServerData)
        console.log(server)

        res.status(200).json({server})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

// get servers a user has joined or created
const getServer = async (req,res) => {

    const user_id = req.user._id

    try {
        const servers = await Server.find({ members: user_id }).sort({createdAt: -1});
        res.status(200).json(servers);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }


}


module.exports = {
    addServer,
    getServer
}