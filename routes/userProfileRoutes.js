const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {updateStatus, getFriends, getPendingUsers, getBlockedUsers} = require('../controllers/userProfileController')

const router = express.Router()

router.use(requireAuth)

router.post('/friends', getFriends)

router.post('/pending', getPendingUsers)

router.post('/blocked', getBlockedUsers)

router.patch('/updateStatus', updateStatus)


module.exports = router