const fs = require('fs')

module.exports = {
    readFile: path => new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: 'utf-8' }, (error, data) => {
            if (error) {
                return reject(error)
            }

            resolve(data)
        })
    })
}
