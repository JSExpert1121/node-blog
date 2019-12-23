const { check } = require('express-validator')
const { commonValidator } = require('../common')

module.exports = {
    register: [
        check('first_name')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty'),
        check('last_name')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty'),
        check('email')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty')
            .isEmail()
            .withMessage('Not valid email address'),
        check('password')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty')
            .isLength({
                min: 8
            }).withMessage('Password is too short'),
        commonValidator
    ],
    login: [
        check('email')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty')
            .isEmail()
            .withMessage('Not valid email address'),
        check('password')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty'),
        commonValidator
    ],
    verifyEmail: [
        check('secToken')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty'),
        commonValidator
    ],
    forgotPassword: [
        check('email')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty')
            .isEmail()
            .withMessage('Not valid email address'),
        commonValidator
    ],
    resetPassword: [
        check('secToken')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty'),
        check('password')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty')
            .isLength({
                min: 8
            }).withMessage('Password is too short'),
        commonValidator
    ],
    refresh: [
        check('secToken')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty'),
        commonValidator
    ]
}

