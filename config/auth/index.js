const jwt = require('jsonwebtoken')
const conn = require('../database')

const auth = (req, res, next) =>{
    let token = req.header('Authorization');

    // misalnya id = 10 
    let decoded = jwt.verify(token, 'secret_key')

    let sql = `SELECT * FROM table_staff WHERE id = ${decoded.id}`

    conn.query(sql, (err,result) =>{
        if (err) {
            return res.send(err)
        }

        req.staff = result[0]
        next()
    })
}

module.exports = auth;