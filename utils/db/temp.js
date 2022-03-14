const fs = require('fs').promises
const writeTemp = (file, content) => {
    const modifyContent = `${content}$#`
    return new Promise(async (resolve, reject) => {
        try {
            await fs.appendFile(file, modifyContent)
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

const readTemp = (file) => {
    return new Promise(async (resolve ,reject) => {
        try {
            const content = await fs.readFile(file)
            resolve(content.toString('utf8'))
        } catch (err) {
            reject(err)
        }
    })
}

const cleanTemp = (file, cleanContent) => {
    return new Promise(async (resolve, reject) => {
        const content = await readTemp(file)
        const contentAsArray = content.split('$#')
        const indexOfClean = contentAsArray.indexOf(cleanContent)
        contentAsArray.splice(indexOfClean, 1)
        const modifiedContent = contentAsArray.join('$#')
        try {
            await fs.writeFile(file, modifiedContent)
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

const tempIsEmpty = (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await fs.readFile(file)
            if (result.length > 0)
                resolve(false)
            else
                resolve(true)
        } catch (err) {
            reject(err)
        }
    })
}

exports.tempIsEmpty = tempIsEmpty
exports.writeTemp = writeTemp
exports.readTemp = readTemp
exports.cleanTemp = cleanTemp