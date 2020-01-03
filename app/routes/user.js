const express = require('express')

const authMiddleware = require('../middleware/auth')
const userValidator = require('../middleware/validator/user')
const userController = require('../controllers/user')

const router = express.Router()

router.use(
    authMiddleware.authRequired,
    authMiddleware.sessionValid,
    authMiddleware.notExpired
)

router.post('/',
    userValidator.updateUsername,
    userController.updateUsername
)

router.post('/changepass',
    userValidator.changePassword,
    userController.changePassword
)

module.exports = router
