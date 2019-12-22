require('../../config/passport')
const passport = require('passport')

module.exports = {
    authRequired: (req, res, next) =>
        passport.authenticate('jwt', {
            session: false
        })(req, res, next),
    notExpired: (req, res, next) => {
        const user = req.user
        if (user.expired && user.expired > (Date.now() / 1000)) {
            return next()
        }

        res.status(401).json({
            errors: 'Token expired'
        })
    },
}
