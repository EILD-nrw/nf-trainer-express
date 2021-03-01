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
 * @param taskId ID of the current task
 * @param language Language of the task ('de' for german, everything else returns english)
 * @returns {Promise<number>} Returns 'Aufgabentext' and 'NF' from the Database
 */
async function getTask(taskId, language) {
        if (language === 'de') {
            let { rows } = await pool.query('SELECT AUFGABENTEXT, NF FROM AUFGABEN WHERE ID = $1', [taskId])
            return rows[0]
        } else {
            let { rows } = await pool.query('SELECT AUFGABENTEXT, NF FROM AUFGABEN_EN WHERE ID = $1', [taskId])
            return rows[0]
        }
}

export {
    get_task,
}