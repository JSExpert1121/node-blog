const { validationResult } = require('express-validator')

module.exports = {
    commonValidator: function (req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            })
        }

        return next()
    },
    handleError: function (res, error) {
        if (process.env.NODE_ENV === 'development') {
            console.log(error)
        }

        res.status(error.code || 500).json({
            errors: error.message
        })
    }
}
