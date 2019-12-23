const validator = require('validator')
const { check } = require('express-validator')
const { commonValidator } = require('../common')

module.exports = {
    verifyPhone: [
        check('code')
            .exists()
            .withMessage('Missing')
            .custom(v => v.length === 4)
            .withMessage('Code length should be equal 4'),
        commonValidator
    ],
    sendSMS: [
        check('phone')
            .exists()
            .withMessage('Missing')
            .custom(v => /^[0-9]+$/.test(v))
            .withMessage('Invalid phone number'),
        commonValidator
    ]
}
