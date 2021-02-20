const express = require('express')
const { Pool } = require('pg')

const app = express()

// Example Client settings (should probably be moved into an external file / environment variables)
// Use Pools instead of clients later
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'nf_trainer',
    password: 'postgres',
    port: 5432,
})

// Get using asynchronous function to avoid callbacks
app.get('/', async (req, res) => {
    let client =  await pool.connect()
    let { rows } = await client.query('SELECT NOW()')
    res.send(rows[0])
    client.release()
})

app.listen(8080, () => {
    console.log('Server listening at http:/localhost:8080')
})