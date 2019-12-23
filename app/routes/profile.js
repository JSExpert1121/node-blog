const express = require('express')
const authMiddleware = require('../middleware/auth')
const profileValidator = require('../middleware/validator/profile')

const profileController = require('../controllers/profile')

const router = express.Router()

router.use(
    authMiddleware.authRequired,
    authMiddleware.sessionValid,
    authMiddleware.notExpired
)

router.get('/',
    profileController.get
)

router.put('/',
    profileController.update
)

router.post('/avatar',
    profileController.uploadAvatar
)

router.post('/sendcode',
    profileValidator.sendSMS,
    profileController.sendSMS
)

router.post('/phoneverify',
    profileValidator.verifyPhone,
    profileController.verifyPhone
)

router.post('/education',
    profileValidator.education,
    profileController.addEducation
)

router.post('/work',
    profileValidator.work,
    profileController.addWork
)

router.post('/education/:id',
    profileValidator.education,
    profileController.updateEducation
)

router.post('/work/:id',
    profileValidator.work,
    profileController.updateWork
)

router.delete('/education/:id',
    profileController.deleteEducation
)

router.delete('/work/:id',
    profileController.deleteWork
)

module.exports = router
