const express = require('express')
const { execQuery } = require('./utils/db/db')
const { writeTemp, tempIsEmpty, readTemp, cleanTemp } = require('./utils/db/temp')
const ping = require('./utils/ping')

const app = express()
const PORT = process.env.SERVER_PORT || "6666"

const TEMP = "./temp"

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
                console.log(await readTemp(TEMP))
            }
        })
    }
}

setInterval(() => {
    tempMonitoring()
}, 4000)

app.use(express.json())
app.post('/request', async (req, res) => {
    const command = req.body.command || "test"
    await writeTemp(TEMP, command)
    res.sendStatus(200)
})
app.listen(PORT, () => {
    console.log(`SERVER NOW LISTENING AT PORT ${PORT}`)
})