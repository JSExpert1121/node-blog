const { matchedData } = require('express-validator')

// const Profile = require('../models/profile')
const { handleError } = require('../middleware/common')

const phone = require('../../service/phone')


module.exports = {
    async get(req, res) {
        const user = req.user

        try {
            await user.populate('profile', '-user -meta').execPopulate()
            res.json({
                profile: user.profile
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async update(req, res) {
        const user = req.user

        try {
            const body = req.body

            await user.populate('profile', '-user -meta').execPopulate()
            let profile = user.profile
            for (let key in body) {
                profile[key] = body[key]
            }
            await profile.save()

            res.json({
                profile: profile
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async sendSMS(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            await user.populate('profile').execPopulate()
            const profile = user.profile

            profile.code.value = parseInt(Math.random() * 9000) + 1000
            profile.code.expire = parseInt(Date.now() / 1000 + 20)      // expired: in 10 seconds
            profile.phone = `${body.phone}`

            await phone.sendSMS(body.phone, `${profile.code.value}`)
            await profile.save()

            res.json({
                success: 'Message sent to your phone'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async verifyPhone(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            await user.populate('profile').execPopulate()
            const profile = user.profile

            if (profile.code.expire < parseInt(Date.now() / 1000)) {
                return res.status(400).json({
                    errors: 'Code was expired'
                })
            }

            if (profile.code.value !== parseInt(body.code)) {
                return res.status(400).json({
                    errors: 'Invalid code'
                })
            }

            profile.phoneVerified = true
            profile.code = null
            await profile.save()

            res.json({
                success: 'Your phone was verified successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    }
}

