const { Pool } = require('pg')

// Basic Pool Connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nf_trainer',
    password: 'postgres',
    port: 5432,
})

/**
 * Helper Function to get a certain task from the database
 *
 * @param task_id ID of the current task
 * @param language Language of the task ('de' for german, everything else returns english)
 * @returns {Promise<number>} Returns 'Aufgabentext' and 'NF' from the Database
 */
async function get_task(task_id, language) {
    if (language === 'de') {
        let { rows } = await pool.query('SELECT AUFGABENTEXT, NF FROM AUFGABEN WHERE ID = $1', task_id)
        return rows
    } else {
        let { rows } = await pool.query('SELECT AUFGABENTEXT, NF FROM AUFGABEN_EN WHERE ID = $1', task_id)
        return rows
    }
}

export {
    get_task,
}





