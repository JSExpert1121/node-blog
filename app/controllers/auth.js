const { matchedData } = require('express-validator')
const jwt = require('jsonwebtoken')

const { handleError } = require('../middleware/common')
const User = require('../models/user')
const mailer = require('../../service/mailer')
const cryptor = require('../../utils/crypto')


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

            const user = new User({
                name: {
                    first: body.first_name,
                    last: body.last_name
                },
                email: body.email,
                password: body.password
            })

            await user.save()
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
            const user = await findUser(body.email, 'name email password')
            if (!user) {
                return res.status(404).json({
                    errors: 'User not found'
                })
            }

            const result = await user.comparePassword(body.password)
            if (!result) {
                return res.json({
                    errors: 'Password not match'
                })
            }

            return res.json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.eamil,
                },
                token: generateToken(user)
            })
        } catch (error) {
            handleError(res, error)
        }
    },
    async verifyEmail(req, res) {
        const body = matchedData(req)
        try {
            const payload = jwt.decode(body.secToken)
            if (payload && payload.id === req.user.id) {
                User.findById(payload.id, (error, user) => {
                    if (error) {
                        return handleError(res, error)
                    }

                    user.profile.emailVerified = true
                    user.save()
                    res.json({
                        success: 'Email verified successfully'
                    })
                })
            } else {
                res.status(400).json({
                    errors: 'Invalid token'
                })
            }
        } catch (error) {
            handleError(res, error)
        }
    }
}

function generateToken(user) {
    const expired = Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRE
    return cryptor.encrypt(jwt.sign({
        id: user._id,
        expired
    }, process.env.JWT_SECRET))
}

async function findUser(email, fields = null) {
    return new Promise((res, rej) => {
        User.findOne({ email }, fields, (error, user) => {
            if (error) {
                return rej(error)
            }

            console.log(user)
            res(user)
        })
    })
}

async function sendVerificationMail(user) {
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    const context = {
        clientURL: process.env.CLIENT_URL,
        token
    }

    await mailer.sendMailFromTemplate({
        name: user.username,
        email: user.email
    }, 'Verify your mail', 'templates/verification.html', context)
}
