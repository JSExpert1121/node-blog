const { matchedData } = require('express-validator')
const { handleError } = require('../middleware/common')
const User = require('../models/user')

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
        try {
            const body = matchedData(req)
            const user = await User.findUser(req.user.email, 'name email password access')
            const result = await user.comparePassword(body.oldPassword || '')
            if (!result) {
                return res.status(400).json({
                    errors: 'Old password does not match'
                })
            }
            user.password = body.newPassword
            await user.save()

            res.json({
                success: 'OK'
            })
        } catch (error) {
            handleError(res, error)
        }
    }
}
