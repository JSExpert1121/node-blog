const Nexmo = require('nexmo')

module.exports = {
    sendSMS: (to, msg) => new Promise((resolve, reject) => {
        const nexmo = new Nexmo({
            apiKey: process.env.NEXMO_KEY,
            apiSecret: process.env.NEXMO_SECRET
        })

        const from = 'Nexmo'
        nexmo.message.sendSms(from, to, msg, (error, data) => {
            if (error) {
                return reject(error)
            }

            resolve(data)
        })
    })
}
