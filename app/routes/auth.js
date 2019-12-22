const express = require('express')
const authValidators = require('../middleware/validator/auth')

const authController = require('../controllers/auth')
const authMiddleware = require('../middleware/auth')

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
    authMiddleware.authRequired,
    authMiddleware.notExpired,
    authValidators.verifyEmail,
    authController.verifyEmail
)

router.post('/forgot-password', (req, res) => {
    res.json(req.body)
})

router.post('/reset', (req, res) => {
    res.json(req.body)
})

router.post('/refresh', (req, res) => {
    res.json(req.body)
})

router.post('/logout', (req, res) => {
    res.json(req.body)
})


module.exports = router
