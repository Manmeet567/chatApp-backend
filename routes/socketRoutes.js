const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { newConnection } = require('../controllers/socketController')

const router = express.Router()

// require Auth for all server routes
router.use(requireAuth);

// store socket id in database, the moment a user connects.
router.post('/newConnection', newConnection);

module.exports = router