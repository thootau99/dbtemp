const mysql = require('mysql')

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
});

const execQuery = sql_command => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            try {
                connection.query(sql_command, (err, result, fields) => {
                    connection.release()
                    if (err) reject(err)
                    resolve(result)
                })
            } catch (err) {
                console.log(err)
            }
            
        })
    })
}

exports.execQuery = execQuery