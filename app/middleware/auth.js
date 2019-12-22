require('../../config/passport')
const passport = require('passport')

module.exports = {
    authRequired: (req, res, next) =>
        passport.authenticate('jwt', {
            session: false
        })(req, res, next),
    sessionValid: (req, res, next) => {
        const user = req.user
        if (!user.access ||
            !user.access.session ||
            user.access.session !== user.session) {
            return res.status(401).json({
                errors: 'You must log in again'
            })
        }

        return next()
    },
    notExpired: (req, res, next) => {
        const user = req.user
        if (!user.expired || user.expired < (Date.now() / 1000)) {
            return res.status(401).json({
                errors: 'Token expired'
            })
        }

        return next()
    }
}
