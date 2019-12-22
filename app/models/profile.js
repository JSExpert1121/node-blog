const mongoose = require('mongoose')
const validator = require('validator')

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        avatar: {
            type: String,
            validator: {
                validator: v => v === '' ? true : validator.isURL(v),
                message: 'Not valid URL'
            }
        },
        phone: String,
        address1: String,
        address2: String,
        city: String,
        country: String,
        phoneVerified: Boolean,
        twitter: {
            type: String,
            validate: {
                validator: v => v === '' ? true : validator.isURL(v),
                message: 'Not valid URL'
            }
        },
        github: {
            type: String,
            validate: {
                validator: v => v === '' ? true : validator.isURL(v),
                message: 'Not valid URL'
            }
        },
        linkedin: {
            type: String,
            validate: {
                validator: v => v === '' ? true : validator.isURL(v),
                message: 'Not valid URL'
            }
        },
        facebook: {
            type: String,
            validate: {
                validator: v => v === '' ? true : validator.isURL(v),
                message: 'Not valid URL'
            }
        },
        meta: {
            follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        }
    },
    {
        validateBeforeSave: true
    }
)

module.exports = mongoose.model('Profile', profileSchema)