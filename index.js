const express = require('express')
const { execQuery } = require('./utils/db/db')
const { writeTemp, tempIsEmpty, readTemp, cleanTemp } = require('./utils/db/temp')
const ping = require('./utils/ping')

const app = express()
const PORT = process.env.SERVER_PORT || "6666"

const TEMP = "./temp"

const tempGet = {}

async function tempMonitoring() {
    const empty = await tempIsEmpty(TEMP)
    if (!empty) {
        const temps = await readTemp(TEMP)
        let tempSplit = temps.split('$#')
        tempSplit.map(async (_temp, index) => {
            if (!_temp) {
                return
            } else {
                await execQuery(_temp)
                await cleanTemp(TEMP, `${_temp}\$#`)
            }
        })
    }
}

function getSelectResult(command) {
    return new Promise(async (resolve, reject) => {
        if (command in tempGet) {
            // check result expired?
            const saved = tempGet[command]
            if (saved.date - new Date().getTime() > 10000) {
                const result = await execQuery(command)
                tempGet[command] = {
                    value: result,
                    date: new Date().getTime()
                }
                resolve(result)
            } else {
                resolve(saved.value)
            }
        } else {
            if (ping(process.env.MYSQL_HOST)) {
                const result = await execQuery(command)
                tempGet[command] = {
                    value: result,
                    date: new Date().getTime()
                }
                resolve(result)
            }
        }
    })
}

setInterval(() => {
    tempMonitoring()
}, 4000)

app.use(express.json())

app.post('/select', async (req, res) => {
    try {
        const command = req.body.command
        const result = await getSelectResult(command)
        res.send(result).status(200)
    } catch (err) {
        res.send(err).status(500)
    }
})

app.post('/request', async (req, res) => {
    const command = req.body.command
    await writeTemp(TEMP, command)
    res.sendStatus(200)
})
app.listen(PORT, () => {
    console.log(`SERVER NOW LISTENING AT PORT ${PORT}`)
})