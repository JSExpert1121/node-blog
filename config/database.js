const mongoose = require('mongoose')

const DB_URL = process.env.MONGO_URI


module.exports = () => {
    const connectDB = () => {
        mongoose.connect(
            DB_URL,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            error => {
                const status = error ?
                    `********* Error connecting to DB: ${error} ***********` :
                    `********* DB connected **********`
                console.log(status)
            }
        )

        mongoose.set('useCreateIndex', true)
        mongoose.set('useFindAndModify', true)
    }

    connectDB()

    mongoose.connection.on('error', console.log)
    mongoose.connection.on('disconnected', connectDB)
}
