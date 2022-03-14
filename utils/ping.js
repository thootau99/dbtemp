const ping = require('ping')
const pingServer = ip => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await ping.promise.probe(ip, {
                timeout: 3
            })
            resolve(result.alive)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = pingServer