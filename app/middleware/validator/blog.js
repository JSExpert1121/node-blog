const { check } = require('express-validator')
const { commonValidator } = require('../common')

const tags = require('../../models/tags')

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
            .custom(v => v.every(item => tags.indexOf(item) >= 0))
            .withMessage('Unknown tag')
            .isLength({
                min: 1
            })
            .withMessage('There should exist at least tag'),
        commonValidator
    ],
    addComment: [
        check('content')
            .exists()
            .withMessage('Missing'),
        commonValidator
    ]
}
