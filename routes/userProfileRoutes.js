const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {updateStatus, getFriends, getPendingUsers, getBlockedUsers, addFriendRequest} = require('../controllers/userProfileController')

const router = express.Router()

router.use(requireAuth)

router.post('/friends', getFriends)

router.post('/pending', getPendingUsers)

router.post('/blocked', getBlockedUsers)

router.patch('/updateStatus', updateStatus)

router.post('/sendFriendRequest', addFriendRequest)

module.exports = router