const mongoose = require('mongoose')
const validator = require('validator')

const blogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        cover: {
            type: String,
            validator: {
                validator: v => v === '' ? true : validator.isURL(v),
                message: 'Not valid URL'
            }
        },
        title: {
            type: String,
            required: true
        },
        short: String,
        description: {
            type: String,
            required: true
        },
        tags: [{
            type: String,
            enum: require('./tags')
        }],
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        },
        claps: {
            type: Number,
            default: 0
        },
        edited: Date
    },
    {
        versionKey: false,
        validateBeforeSave: true,
        timestamps: true,
    }
)

module.exports = mongoose.model('Blog', blogSchema)
