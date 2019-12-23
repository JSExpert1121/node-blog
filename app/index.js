require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const i18n = require('i18n')
const path = require('path')

const app = express()

app.set('port', process.env.PORT || 8000)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))

// 18n
i18n.configure({
    locales: ['en', 'es', 'kr'],
    directory: `${__dirname}/../locales`
})
app.use(i18n.init)

app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.use(express.static('public'))
app.use(express.static('media'))
process.env.MEDIA_ROOT = path.join(__dirname, '../media')

app.use('/api/v1', require('./routes'))

module.exports = app
