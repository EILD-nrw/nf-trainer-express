const { Pool } = require('pg')

// Basic Pool Connection
const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'nf_trainer',
    password: 'postgres',
    port: 5432,
})

async function getTaskCount() {
    let { rows } = await pool.query('SELECT COUNT(DISTINCT aufgabenid) FROM loesungen')
    let temp = rows[0]['count']
    return parseInt(temp)
}

/**
 * Get a certain task from the database
 *
 * @param taskId ID of the current task
 * @param language Language of the task ('de' for german, everything else returns english)
 * @returns {Promise<*>} Returns 'Aufgabentext' and 'NF' from the Database
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

/**
 * Get a Subtask from Database
 *
 * @param subtaskId ID of the current subtask
 * @param language Language of the current user
 * @returns {Promise<*>} Returns 'Aufgabentext' from the Database
 */
async function getSubtask(subtaskId, language) {
    if (language === 'de') {
        let { rows } = await pool.query('SELECT AUFGABENTEXT FROM UNTERAUFGABEN WHERE ID = $1', [subtaskId])
        return rows[0]
    } else {
        let { rows } = await pool.query('SELECT AUFGABENTEXT FROM UNTERAUFGABEN_EN WHERE ID = $1', [subtaskId])
        return rows[0]
    }
}

function getTaskTableQuerystring(taskId, nf, language) {
    let querystring = taskId.toString()
    if (nf !== 0) {
        querystring += '_1'
    }
    if (language !== 'de') {
        querystring += '_EN'
    }
    return querystring
}

/**
 * Get the Table that the user has to transform through the normal forms
 *
 * @param taskId ID of the current task
 * @param nf 1 if the current subtask is already in 1NF, 0 otherwise
 * @param language Language of the current user
 * @returns {Promise<*>} Returns the task table
 */
async function getTaskTable(taskId, nf, language) {
    let querystring = getTaskTableQuerystring(taskId, nf, language)

    let { rows } = await pool.query(`SELECT * FROM AUFGABE${querystring}`)
    return rows
}

async function getSubTaskTable(taskId, nf, solution, language) {
    let columns = solution.replace(':', ',')
    let querystring = getTaskTableQuerystring(taskId, nf, language)

    let { rows } = await pool.query(`SELECT DISTINCT ${columns} FROM AUFGABE${querystring}`)
    return rows
}

/**
 * Get solution for the current subtask of a certain task in the specified language.
 * Note that each subtask may have a different solution format.
 *
 * @param taskId ID of the current task
 * @param subtaskId ID of the current subtask
 * @param language Language of the current user
 * @returns {Promise<*>} Returns list of solution data
 */
async function getSolution(taskId, subtaskId, language) {
    if (language === 'de') {
        let { rows } = await pool.query('SELECT LOESUNG FROM LOESUNGEN WHERE AUFGABENID = $1 AND UNTERAUFGABENID = $2', [taskId, subtaskId])
        return rows
    } else {
        let { rows } = await pool.query('SELECT LOESUNG FROM LOESUNGEN_EN WHERE AUFGABENID = $1 AND UNTERAUFGABENID = $2', [taskId, subtaskId])
        return rows
    }
}

module.exports = {
    getTaskCount,
    getTask,
    getSubtask,
    getTaskTable,
    getSubTaskTable,
    getSolution,
}