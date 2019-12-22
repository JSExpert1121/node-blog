const express = require('express')
const authValidators = require('../middleware/validator/auth')

const authController = require('../controllers/auth')
// const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.post('/signup',
    authValidators.register,
    authController.signup
)

router.post('/login',
    authValidators.login,
    authController.login
)

router.post('/verifymail',
    authValidators.verifyEmail,
    authController.verifyEmail
)

router.post('/forgot-password',
    authValidators.forgotPassword,
    authController.forgotPassword
)

router.post('/reset',
    authValidators.resetPassword,
    authController.resetPassword
)

router.post('/refresh', (req, res) => {
    res.json(req.body)
})

router.post('/logout', (req, res) => {
    res.json(req.body)
})


module.exports = router
