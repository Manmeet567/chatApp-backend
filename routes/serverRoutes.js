const express = require('express')
const { addServer,getServer } = require('../controllers/serverController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require Auth for all server routes
router.use(requireAuth)

// create server route
router.post('/addServer', addServer)

// get servers which the user has joined or created
router.get('/getServer', getServer)

module.exports = router