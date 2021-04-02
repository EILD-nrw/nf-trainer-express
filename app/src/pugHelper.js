const db = require('./database')

async function getTasks(taskNr, subtaskNr) {
    let variables = {}
    variables['task'] = await db.getTask(taskNr, 'de')
    variables['subtask'] = await db.getSubtask(subtaskNr, 'de')

    return variables
}

function getTaskTableNF(taskNr, subtaskNr) {
    // TODO Replace with database call once task editor is implemented
    // Task 2 is not in 1NF and gets another table
    if (taskNr === 2 && subtaskNr >= 2) {
        return 1
    } else {
        return 0
    }
}

async function getTaskTable(taskNr, subtaskNr) {
    let variables = {}

    let taskTableNF = getTaskTableNF(taskNr, subtaskNr)
    let taskTable = await db.getTaskTable(taskNr, taskTableNF, 'de')

    variables['tasktable'] = taskTable
    variables['keys'] = Object.keys(taskTable[0])

    return variables
}

async function getSubTaskTables(taskNr, subtaskNr, nf) {
    let subTaskTables = []

    // Task 2 currently requires special handling
    let taskTableNF = getTaskTableNF(taskNr, subtaskNr)
    let subtaskWithTaskTableColumns

    // 2NF columns are stored in subtask 5, 3NF in subtask 6
    if (nf === 2) {
        subtaskWithTaskTableColumns = 5
    } else {
        subtaskWithTaskTableColumns = 6
    }

    // Get solution-strings from the corresponding subtasks
    let solutions =  await db.getSolution(taskNr, subtaskNr, 'de')

    // Get subTaskTables for all solution-strings
    for (let solution of solutions) {
        let subTaskTable = await db.getSubTaskTable(taskNr, taskTableNF, solution, 'de')
        subTaskTables.push(subTaskTable)
    }

    let variables = {}
    variables['subTaskTables'] = subTaskTables
    return variables
}

async function getSubtaskSolution(taskNr, subtaskNr) {
    let variables = {}
    let solutionClear = await db.getSolution(taskNr, subtaskNr, 'de')
    let solutionString = ''
    for (let part of solutionClear) {
        solutionString += (part.loesung + ';')
    }
    variables['solution'] = solutionString
    variables['solutionClear'] = solutionClear

    return variables
}

async function getFuncSolution(taskNr) {
    let variables = {}

    let solutionFuncDepClear = await db.getSolution(taskNr, 3, 'de')
    let solutionFuncDepString = ''
    for (let part of solutionFuncDepClear) {
        solutionFuncDepString += (part.loesung + ';')
    }
    variables['solutionFuncDepString'] = solutionFuncDepString

    for (element of solutionFuncDepClear) {
        element.loesung = element.loesung.replace(new RegExp(':', 'g'), ': ').replace(new RegExp(',', 'g'), ', ')
    }

    variables['solutionFuncDepClear'] = solutionFuncDepClear

    return variables
}

async function getCompleteSolution(taskNr) {
    let variables = {}

    // Inefficient db call but much more readable code
    let solutionFuncDepClear = await db.getSolution(taskNr, 3, 'de')
    for (element of solutionFuncDepClear) {
        element.loesung = element.loesung.replace(new RegExp(':', 'g'), ': ').replace(new RegExp(',', 'g'), ', ')
    }
    variables['solutionFuncDepClear'] = solutionFuncDepClear

    let solutionPKClear = await db.getSolution(taskNr, 4, 'de')
    let solutionStringPK = ''
    for (let part of solutionPKClear) {
        solutionStringPK += (part.loesung + ';')
    }

    for (element of solutionPKClear) {
        element.loesung = element.loesung.replace(new RegExp(';', 'g'), '; ')
    }

    variables['solutionPKString'] = solutionStringPK
    variables['solutionPKClear'] = solutionPKClear

    let completeSolution = [];
    let funcDep = variables['solutionFuncDepClear'];
    let pks = variables['solutionPKClear'];

    for (let i = 0; i < funcDep.length; i++) {
        let possiblePKS = funcDep[i].loesung.split(": ")[0].split(", ");
        let count = 0;
        for (let a = 0; a < possiblePKS.length; a++) {
            for (let b = 0; b < pks.length; b++) {
                if (pks[b].loesung.localeCompare(possiblePKS[a]) === 0) {
                    count = count + 1;
                }
            }
        }

        if (count === pks.length) {
            completeSolution[i] = funcDep[i].loesung + " → " + "voll";
        } else if (count === 0) {
            completeSolution[i] = funcDep[i].loesung + " → " + "transitiv";
        } else {
            completeSolution[i] = funcDep[i].loesung + " → " + "partiell";
        }
    }

    variables['completeSolution'] = completeSolution;

    return variables
}

module.exports = {
    getTasks,
    getTaskTable,
    getSubTaskTables,
    getSubtaskSolution,
    getFuncSolution,
    getCompleteSolution,
}