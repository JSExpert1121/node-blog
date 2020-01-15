const fs = require('fs')
const uuidv4 = require('uuid/v4')
const { matchedData } = require('express-validator')
const formidable = require('formidable')

const Profile = require('../models/profile')
const { handleError } = require('../middleware/common')
const phone = require('../../service/phone')


module.exports = {
    async updateUsername(req, res) {
        const user = req.user
        try {
            const body = matchedData(req)
            user.name.first = body.first_name
            user.name.last = body.last_name
            await user.save()

            res.json({
                id: user._id,
                username: user.username,
                email: user.email
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async changePassword(req, res) {
        const user = req.user
        try {
            const body = matchedData(req)
            const result = await user.comparePassword(body.oldPassword)
            if (!result) {
                return res.status(400).json({
                    errors: 'Old password does not match'
                })
            }
            user.password = body.newPassword
            await user.save()

            res.json({
                id: user._id,
                username: user.username,
                email: user.email
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async get(req, res) {
        const user = req.user

        try {
            await user.populate('profile', '-user').execPopulate()
            res.json({
                profile: user.profile
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getPublic(req, res) {
        Profile.findOne({ user: req.params.id }, 'avatar title description hobbies qualification twitter github linkedin facebook')
            .populate('user', 'name')
            .exec((err, doc) => {
                if (err) {
                    handleError(res, err)
                } else {
                    res.json({
                        public: doc
                    })
                }
            })
    },

    async update(req, res) {
        const user = req.user

        try {
            const body = req.body

            await user.populate('profile', '-user').execPopulate()
            let profile = user.profile
            for (let key in body) {
                console.log(key)
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

    async uploadAvatar(req, res) {
        const user = req.user

        try {
            const form = new formidable.IncomingForm()
            form.encoding = 'utf-8'
            form.keepExtensions = true

            form.maxFileSize = process.env.MAX_FILE_SIZE
            const path = await new Promise((resolve, reject) => {
                form.parse(req)
                    .on('fileBegin', (name, file) => {
                        const folder = `${process.env.MEDIA_ROOT}/avatar`
                        if (!fs.existsSync(folder)) {
                            fs.mkdirSync(folder, { recursive: true })
                        }

                        file.name = `${uuidv4()}-${file.name}`
                        file.path = `${folder}/${file.name}`
                        console.log(file.path)
                    })
                    .on('error', error => reject(error))
                    .on('file', (name, file) => {
                        resolve(file.name)
                    })
            })

            await user.populate('profile').execPopulate()
            const profile = user.profile
            profile.avatar = `${process.env.SERVER_URL}/avatar/${path}`
            await profile.save()
            res.json({
                avatar: profile.avatar
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
            profile.code.expire = parseInt(Date.now() / 1000 + 60)      // expired: in 10 seconds
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
                success: 'Your phone has been verified successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async addEducation(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            await user.populate('profile').execPopulate()
            const profile = user.profile

            const educations = profile.qualification.education || []
            educations.push({
                university: body.university,
                specialty: body.specialty,
                start: new Date(body.start),
                end: new Date(body.end),
                degree: body.degree
            })
            profile.qualification.education = educations
            await profile.save()

            res.json({
                success: 'Education has been added successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async addWork(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            await user.populate('profile').execPopulate()
            const profile = user.profile

            const history = profile.qualification.history || []
            history.push({
                title: body.title,
                company: body.company,
                start: new Date(body.start),
                end: new Date(body.end),
                role: body.role,
                content: req.body.content
            })
            profile.qualification.history = history
            await profile.save()

            res.json({
                success: 'Work history has been added successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async updateEducation(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            await user.populate('profile').execPopulate()
            const profile = user.profile

            const educations = profile.qualification.education || []
            const current = educations.find(item => item._id.toString() === req.params.id)
            if (!current) {
                return res.status(400).json({
                    errors: 'Invalid education id'
                })
            }

            for (let key in body) {
                current[key] = body[key]
            }
            await profile.save()

            res.json({
                success: 'Education has been updated successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async updateWork(req, res) {
        const user = req.user

        try {
            const body = matchedData(req)
            await user.populate('profile').execPopulate()
            const profile = user.profile

            const history = profile.qualification.history || []
            const current = history.find(item => item._id.toString() === req.params.id)
            if (!current) {
                return res.status(400).json({
                    errors: 'Invalid work id'
                })
            }

            for (let key in body) {
                current[key] = body[key]
            }
            if (req.body.content) {
                current.content = req.body.content
            }

            await profile.save()

            res.json({
                success: 'Work history has been updated successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async deleteEducation(req, res) {
        const user = req.user

        try {
            await user.populate('profile').execPopulate()
            const profile = user.profile

            const educations = profile.qualification.education || []
            const newEducations = educations.filter(item => item._id.toString() !== req.params.id)
            profile.qualification.education = newEducations
            await profile.save()

            res.json({
                success: 'Education has been deleted successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    async deleteWork(req, res) {
        const user = req.user

        try {
            await user.populate('profile').execPopulate()
            const profile = user.profile

            const history = profile.qualification.history || []
            const newHistory = history.filter(item => item._id.toString() !== req.params.id)
            profile.qualification.history = newHistory
            await profile.save()

            res.json({
                success: 'Work history has been deleted successfully'
            })
        } catch (error) {
            handleError(res, error)
        }
    }
}

