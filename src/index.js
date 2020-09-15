const express = require('express');
const cors = require('cors')
const app = express()
const port = 2020;

// STAFF ROUTES
const staff = require('./staff/staff.js')

app.use(cors())
app.use(express.json())
app.use(staff)

app.get('/', (req,res)=>{
    res.send(`<h1>API Running at Port : ${port}</h1>`)
});

app.listen(port, ()=>{console.log(`API Running at ${port}`)});