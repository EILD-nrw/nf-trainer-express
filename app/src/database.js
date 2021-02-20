const { Pool } = require('pg')

// Basic Pool Connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nf_trainer',
    password: 'postgres',
    port: 5432,
})

let client =  await pool.connect()
let { rows } = await client.query('SELECT NOW()')
res.send(rows[0])
client.release()