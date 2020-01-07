const mongoose = require('mongoose')
const validator = require('validator')

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            select: false
        },
        avatar: {
            type: String,
            validator: {
                validator: v => v === '' ? true : validator.isURL(v),
                message: 'Not valid URL'
            }
        },
        title: String,
        description: String,
        phone: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        hobbies: [String],
        phoneVerified: Boolean,
        qualification: {
            education: [{
                university: {
                    type: String,
                    required: true
                },
                specialty: {
                    type: String,
                    required: true
                },
                start: {
                    type: Date,
                    require: true,
                },
                end: {
                    type: Date,
                    required: true
                },
                degree: {
                    type: String,
                    enum: ['Bachelor', 'Master', 'Doctor'],
                }
            }],
            history: [{
                title: {
                    type: String,
                    required: true
                },
                company: {
                    type: String,
                    required: true
                },
                role: {
                    type: String,
                    enum: [
                        'Intership',
                        'Individual Contributor',
                        'Project Manager',
                        'Team Leader',
                        'CTO'
                    ],
                    required: true
                },
                start: {
                    type: Date,
                    require: true,
                },
                end: {
                    type: Date,
                    required: true
                },
                content: String
            }]
        },
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
        code: {
            value: Number,
            expire: Number
        },
        meta: {
            follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
        }
    },
    {
        versionKey: false,
        validateBeforeSave: true
    }
)

profileSchema.virtual('marks').get(function () {
    return this.meta.follows ? this.meta.follows.length * 100 : 0
})

module.exports = mongoose.model('Profile', profileSchema)
