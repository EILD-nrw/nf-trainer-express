const express = require('express')
const { Pool } = require('pg')
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');

const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Example Client settings (should probably be moved into an external file / environment variables)
// Use Pools instead of clients later
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'nf_trainer',
    password: 'postgres',
    port: 5432,
})


app.get('/insert', async (req, res) => {

  var data = fs.readFileSync('./textfiles/data.txt').toString()

  ;(async function() {
    const client = await pool.connect()
    await client.query(data)
    res.send("ok");
    client.release()
  })()
})

app.get('/drop', async (req, res) => {

  var data = fs.readFileSync('./textfiles/drop.txt').toString()

  ;(async function() {
    const client = await pool.connect()
    await client.query(data)
    res.send("ok");
    client.release()
  })()
})

//to check all existing tables
app.get('/check', async (req, res) => {
  ;(async function() {
    const client = await pool.connect()
    let {rows} = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    res.send(rows)
    client.release()
  })()
})

//test with query
app.get('/get/:tablename', async (req, res) => {

  var tablename = req.params.tablename;

  ;(async function() {
    const client = await pool.connect()
    let {rows} = await client.query("SELECT * FROM " + tablename + ";")
    res.send(rows)
    client.release()
  })()
})


app.listen(8080, () => {
    console.log('Server listening at http:/localhost:8080')
})