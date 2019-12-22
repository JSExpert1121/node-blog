const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true }
        },
        email: {
            type: String,
            validate: {
                validator: validator.isEmail,
                message: 'Email is not valid'
            },
            lowercase: true,
            unique: true,
            required: true
        },
        emailVerified: Boolean,
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'worker'],
            default: 'worker'
        },
        profile: {
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
        }
    },
    {
        versionKey: false,
        timestamps: true,
        validateBeforeSave: true
    }
)

const hashPwd = (user, salt, next) => {
    bcrypt.hash(user.password, salt, (error, result) => {
        if (error) {
            return next(error)
        }

        user.password = result
        return next()
    })
}

const genSalt = (user, factor, next) => {
    bcrypt.genSalt(factor, (error, result) => {
        if (error) {
            return next(error)
        }

        return hashPwd(user, result, next)
    })
}

userSchema.pre('save', function (next) {
    const SALT_FACTOR = 10
    if (!this.isModified('password')) {
        return next()
    }

    return genSalt(this, SALT_FACTOR, next)
})

userSchema.methods.comparePassword = function (pwd) {
    return bcrypt.compare(pwd, this.password)
}

userSchema.virtual('username').get(function () {
    return `${this.name.first} ${this.name.last}`
})

userSchema.statics.emailExists = function (email) {
    return new Promise((res, rej) => {
        this.findOne({ email }, (error, docs) => {
            if (error) {
                rej(error)
            }

            res(!!docs)
        })
    })
}

module.exports = mongoose.model('User', userSchema)
