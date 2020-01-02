/* eslint-disable camelcase */
const { matchedData } = require('express-validator')
const jwt = require('jsonwebtoken')

const { handleError } = require('../middleware/common')
const mailer = require('../../service/mailer')
const cryptor = require('../../utils/crypto')
const uuidv4 = require('uuid/v4')

const User = require('../models/user')
const Profile = require('../models/profile')

/**
 * Signup middleware
 */
module.exports = {
    async signup(req, res) {
        const body = matchedData(req)
        try {
            const isExist = await User.emailExists(body.email)
            if (isExist) {
                return res.status(409).json({
                    email: body.email
                })
            }

            // create a new User instance
            const user = new User({
                name: {
                    first: body.first_name,
                    last: body.last_name
                },
                email: body.email,
                password: body.password
            })
            await user.save()

            // create a new Profile instance with the new user._id
            const profile = new Profile({
                user: user._id
            })
            await profile.save()

            // set a profile id to the user instance
            user.profile = profile._id
            await user.save()

            // send email verification mail
            await sendVerificationMail(user)
            res.json({
                success: 'User was registered successfully'
            })
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error)
            }

            handleError(res, error)
        }
    },

    async login(req, res) {
        const body = matchedData(req)
        try {
            const user = await findUser(body.email, 'name email password access')
            if (!user) {
                return res.status(404).json({
                    errors: 'User not found'
                })
            }

            const result = await user.comparePassword(body.password)
            if (!result) {
                return res.status(401).json({
                    errors: 'Password not match'
                })
            }

            user.access.session = uuidv4()
            await user.save()

            return res.json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
                access_token: generateAccessToken(user),
                refresh_token: generateRefreshToken(user)
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async verifyEmail(req, res) {
        const body = matchedData(req)
        try {
            const payload = jwt.decode(body.secToken)
            if (payload && payload.id) {
                const user = await findUserById(payload.id)
                if (user) {
                    user.emailVerified = true
                    user.save()
                    return res.json({
                        success: 'Email verified successfully'
                    })
                }

                return res.status(400).json({
                    errors: 'Invalid user'
                })
            } else {
                res.status(400).json({
                    errors: 'Invalid token'
                })
            }
        } catch (error) {
            handleError(res, error)
        }
    },

    async forgotPassword(req, res) {
        const body = matchedData(req)
        try {
            const user = await findUser(body.email, 'name email password')
            if (!user) {
                return res.status(404).json({
                    errors: 'User not found'
                })
            }

            const result = await sendResetMail(user)
            if (!result) {
                return res.status(500).json({
                    errors: 'Some errors occured'
                })
            }

            return res.json({
                success: 'Email was sent'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async resetPassword(req, res) {
        const body = matchedData(req)
        try {
            const payload = jwt.decode(body.secToken)
            if (payload && payload.id) {
                const user = await findUserById(payload.id)
                if (user) {
                    user.password = body.password
                    user.save()
                    return res.json({
                        success: 'Password saved successfully'
                    })
                }

                return res.status(400).json({
                    errors: 'Invalid user'
                })
            } else {
                return res.status(400).json({
                    errors: 'Invalid token'
                })
            }
        } catch (error) {
            handleError(res, error)
        }
    },

    refresh(req, res) {
        const body = matchedData(req)

        try {
            const payload = jwt.decode(body.secToken)
            if (payload &&
                payload.email &&
                payload.email === req.user.email) {

                const user = req.user
                return res.json({
                    access_token: generateAccessToken(user),
                    refresh_token: generateRefreshToken(user)
                })

            } else {
                return res.status(400).json({
                    errors: 'Invalid token'
                })
            }
        } catch (error) {
            handleError(res, error)
        }
    },

    async logout(req, res) {
        const user = req.user
        try {
            user.access.session = ''
            await user.save()

            res.json({
                success: 'OK'
            })
        } catch (error) {
            handleError(res, error)
        }
    }
}

function generateAccessToken(user) {
    const expired = Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRE
    return cryptor.encrypt(jwt.sign({
        id: user._id,
        session: user.access.session,
        expired
    }, process.env.JWT_SECRET))
}

function generateRefreshToken(user) {
    return jwt.sign({
        email: user.email,
        session: user.access.session
    }, process.env.JWT_REFRESH_SECRET)
}

async function findUser(email, fields = null) {
    return new Promise((res, rej) => {
        User.findOne({ email }, fields, (error, user) => {
            if (error) {
                return rej(error)
            }

            res(user)
        })
    })
}

async function findUserById(id, fields = null) {
    return new Promise((res, rej) => {
        User.findById(id, fields, (error, user) => {
            if (error) {
                return rej(error)
            }

            res(user)
        })
    })
}

async function sendVerificationMail(user) {
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_VERIFY_SECRET)

    const context = {
        clientURL: process.env.CLIENT_URL,
        token
    }

    return await mailer.sendMailFromTemplate({
        name: user.username,
        email: user.email
    }, 'Verify your mail', 'templates/verification.html', context)
}

async function sendResetMail(user) {
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_VERIFY_SECRET)

    const context = {
        clientURL: process.env.CLIENT_URL,
        token
    }

    return await mailer.sendMailFromTemplate({
        name: user.username,
        email: user.email
    }, 'Reset your password', 'templates/forgot.html', context)
}
