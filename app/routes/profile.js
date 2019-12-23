const express = require('express')
const authMiddleware = require('../middleware/auth')
const profileValidator = require('../middleware/validator/profile')

const profileController = require('../controllers/profile')

const router = express.Router()

router.get('/',
    authMiddleware.authRequired,
    authMiddleware.sessionValid,
    authMiddleware.notExpired,
    profileController.get
)

router.put('/',
    authMiddleware.authRequired,
    authMiddleware.sessionValid,
    authMiddleware.notExpired,
    profileController.update
)

router.post('/sendcode',
    authMiddleware.authRequired,
    authMiddleware.sessionValid,
    authMiddleware.notExpired,
    profileValidator.sendSMS,
    profileController.sendSMS
)

router.post('/phoneverify',
    authMiddleware.authRequired,
    authMiddleware.sessionValid,
    authMiddleware.notExpired,
    profileValidator.verifyPhone,
    profileController.verifyPhone
)

module.exports = router
