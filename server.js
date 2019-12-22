const app = require('./app')
const connectDB = require('./config/database')

connectDB()
app.listen(app.get('port'))

if (require.main !== module) {
    module.exports = app
}
