const passport = require('passport')
const User = require('../app/models/user')
const JwtStrategy = require('passport-jwt').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy

const cryptor = require('../utils/crypto')

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
    jwtFromRequest: req => {
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
    },
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.id, (err, user) => {
        if (err) {
            return done(err, false)
        }

        user.expired = payload.expired
        return !user ? done(null, false) : done(null, user)
    })
}))

/**
 * Google login
 */
passport.use('google', new GoogleStrategy.Strategy({
    clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
}, (request, accessToken, refreshToken, profile, done) => {
    console.log(request, profile, accessToken, refreshToken)
    done(null, false)
}))
