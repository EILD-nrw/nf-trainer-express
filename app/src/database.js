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

async function getSubtask(subtaskId, language) {
    if (language === 'de') {
        let { rows } = await pool.query('SELECT AUFGABENTEXT FROM UNTERAUFGABEN WHERE ID = $1', [subtaskId])
        return rows[0]
    } else {
        let { rows } = await pool.query('SELECT AUFGABENTEXT FROM UNTERAUFGABEN_EN WHERE ID = $1', [subtaskId])
        return rows[0]
    }
}

async function getTaskTable(taskId, nf, language) {
    let querystring = taskId.toString()
    if (nf !== 0) {
        querystring += '_1'
    }
    if (language !== 'de') {
        querystring += '_EN'
    }
    let { rows } = await pool.query('SELECT * FROM AUFGABE' + querystring)
    return rows
}

async function getSolution(taskId, subtaskId, language) {
    if (language === 'de') {
        let { rows } = await pool.query('SELECT LOESUNG FROM LOESUNGEN WHERE AUFGABENID = $1 AND UNTERAUFGABENID = $2', [taskId, subtaskId])
        return rows[0]
    } else {
        let { rows } = await pool.query('SELECT LOESUNG FROM LOESUNGEN_EN WHERE AUFGABENID = $1 AND UNTERAUFGABENID = $2', [taskId, subtaskId])
        return rows[0]
    }
}

module.exports = {
    getTask,
    getSubtask,
    getTaskTable,
    getSolution,
}