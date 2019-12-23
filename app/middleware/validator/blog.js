const { check } = require('express-validator')
const { commonValidator } = require('../common')
const validator = require('validator')

module.exports = {
    addBlog: [
        check('title')
            .exists()
            .withMessage('Missing'),
        check('description')
            .exists()
            .withMessage('Missing'),
        check('tags')
            .exists()
            .withMessage('Missing')
            .isArray()
            .withMessage('Invalid tags')
            .isLength({
                min: 1
            })
            .withMessage('There should exist at least tag'),
        check('cover')
            .custom(v => !v || validator.isURL(v))
            .withMessage('cover image is not a valid URL'),
        commonValidator
    ],
    addComment: [
        check('content')
            .exists()
            .withMessage('Missing'),
        commonValidator
    ]
}
