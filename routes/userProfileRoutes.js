const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {updateStatus, getFriends} = require('../controllers/userProfileController')

const router = express.Router()

router.use(requireAuth)

router.post('/friends', getFriends)

router.patch('/updateStatus', updateStatus)


module.exports = router