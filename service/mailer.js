const mailer = require('nodemailer')
const handlebars = require('handlebars')

const filemanager = require('../utils/filemanager')


module.exports = {
    async sendMailFromTemplate(user, subject, template, context = {}) {
        const transporter = mailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_HOST_USER,
                pass: process.env.EMAIL_HOST_PASSWORD
            }
        })

        const data = await filemanager.readFile(`${__dirname}/../${template}`)
        const engine = handlebars.compile(data)
        const msg = engine(context)

        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.DEFAULT_FROM_EMAIL}>`,
            to: `${user.name} <${user.email}>`,
            subject: subject,
            html: msg
        }

        return await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, error => {
                if (error) {
                    reject(error)
                }

                return resolve(true)
            })
        })
    },

    async sendMail(user, subject, msg) {
        const transporter = mailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_HOST_USER,
                pass: process.env.EMAIL_HOST_PASSWORD
            }
        })

        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.DEFAULT_FROM_EMAIL}>`,
            to: `${user.name} <${user.email}>`,
            subject: subject,
            html: msg
        }

        return await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, error => {
                if (error) {
                    reject(error)
                }

                return resolve(true)
            })
        })
    }
}
