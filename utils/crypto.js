const crypto = require('crypto')
const algorithm = 'aes-256-ecb'
const cryptoKey = process.env.CRYPTO_KEY

module.exports = {
    /**
     * Encrypts text
     * @param {string} text - text to encrypt
     */
    encrypt: text => {
        const cipher = crypto.createCipher(algorithm, cryptoKey)
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex')
        return crypted
    },

    /**
     * Decrypts text
     * @param {string} text - text to decrypt
     */
    decrypt: text => {
        const decipher = crypto.createDecipher(algorithm, cryptoKey)
        try {
            let dec = decipher.update(text, 'hex', 'utf8')
            dec += decipher.final('utf8')
            return dec
        } catch (err) {
            return err
        }
    }

}
