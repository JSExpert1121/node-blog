const express = require('express')
// const fs = require('fs')

const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/profile', require('./profile'))

router.get('/health', (req, res) => res.json('Hello world'))

router.use('*', (req, res) => {
    res.status(404).json({
        error: 'URL Not Found'
    })
})

module.exports = router
