// const validator = require('validator')
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
    ],
    education: [
        check('university')
            .exists()
            .withMessage('Missing'),
        check('specialty')
            .exists()
            .withMessage('Missing'),
        check('start')
            .exists()
            .withMessage('Missing'),
        check('end')
            .exists()
            .withMessage('Missing'),
        check('degree')
            .custom(v => !v || ['Bachelor', 'Master', 'Doctor'].indexOf(v) >= 0)
            .withMessage('Invalid degree'),
        commonValidator
    ],
    work: [
        check('title')
            .exists()
            .withMessage('Missing'),
        check('company')
            .exists()
            .withMessage('Missing'),
        check('start')
            .exists()
            .withMessage('Missing'),
        check('end')
            .exists()
            .withMessage('Missing'),
        check('role')
            .custom(v => !v || [
                'Intership',
                'Individual Contributor',
                'Project Manager',
                'Team Leader',
                'CTO'].indexOf(v) >= 0)
            .withMessage('Invalid role'),
        commonValidator
    ]
}
