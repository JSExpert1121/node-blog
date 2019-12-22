const passport = require('passport')
const User = require('../app/models/user')
const JwtStrategy = require('passport-jwt').Strategy

const cryptor = require('../utils/crypto')
/**
 * Custom extractor
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = req => {
    let token = null
    if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '').trim()
    } else if (req.body.token) {
        token = req.body.token.trim()
    } else if (req.query.token) {
        token = req.query.token.trim()
    }
    if (token) {
        // Decrypts token
        token = cryptor.decrypt(token)
    }
    return token
}

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
    jwtFromRequest: jwtExtractor,
    secretOrKey: process.env.JWT_SECRET
}

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.id, (err, user) => {
        if (err) {
            return done(err, false)
        }

        user.expired = payload.expired
        return !user ? done(null, false) : done(null, user)
    })
})

passport.use(jwtLogin)
