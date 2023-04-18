const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {updateStatus} = require('../controllers/userProfileController')

const router = express.Router()

router.use(requireAuth)

router.patch('/updateStatus', updateStatus)


module.exports = router