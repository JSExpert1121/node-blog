const express = require('express')

const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/profile', require('./profile'))
router.use('/blogs', require('./blog'))

router.get('/health', (req, res) => res.json('Hello world'))

router.use('*', (req, res) => {
    res.status(404).json({
        errors: 'Page not found'
    })
})

module.exports = router
