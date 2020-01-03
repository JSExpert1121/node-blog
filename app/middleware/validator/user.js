const { check } = require('express-validator')
const { commonValidator } = require('../common')

module.exports = {
    updateUsername: [
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
        commonValidator
    ],
    changePassword: [
        check('oldPassword')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty')
            .isLength({
                min: 8
            }).withMessage('Password is too short'),
        check('newPassword')
            .exists()
            .withMessage('Missing')
            .not()
            .isEmpty()
            .withMessage('Is Empty')
            .isLength({
                min: 8
            }).withMessage('Password is too short'),
        commonValidator
    ]
}
