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

async function getTime() {
    let { rows } = await client.query('SELECT NOW()')
    client.release()
    return rows[0]
}

export { getTime }





