const db = require('./database')

async function getTaskCount () {
  return await db.getTaskCount()
}

async function getTasks (taskNr, subtaskNr) {
  const variables = {}
  variables.task = await db.getTask(taskNr, 'de')
  variables.subtask = await db.getSubtask(subtaskNr, 'de')

  return variables
}

function getTaskTableNF (taskNr, subtaskNr) {
  // TODO Replace with database call once task editor is implemented
  // Task 2 is not in 1NF and gets another table
  if (taskNr === 2 && subtaskNr > 2) {
    return 1
  } else {
    return 0
  }
}

async function getTaskTable (taskNr, subtaskNr) {
  const variables = {}

  const taskTableNF = getTaskTableNF(taskNr, subtaskNr)
  const taskTable = await db.getTaskTable(taskNr, taskTableNF, 'de')

  variables.tasktable = taskTable
  variables.keys = Object.keys(taskTable[0])

  return variables
}

async function getSubTaskTables (taskNr, subtaskNr, nf) {
  const subTaskTables = []

  // Task 2 currently requires special handling
  const taskTableNF = getTaskTableNF(taskNr, subtaskNr)
  let subtaskWithTaskTableColumns

  // 2NF columns are stored in subtask 5, 3NF in subtask 6
  if (nf === 2) {
    subtaskWithTaskTableColumns = 5
  } else {
    subtaskWithTaskTableColumns = 6
  }

  // Get solution-strings from the corresponding subtasks
  const solutions = await db.getSolution(taskNr, subtaskWithTaskTableColumns, 'de')

  // Get subTaskTables for all solution-strings
  for (const solution of solutions) {
    const solutionValue = solution.loesung
    const subTaskTable = await db.getSubTaskTable(taskNr, taskTableNF, solutionValue, 'de')
    subTaskTables.push(subTaskTable)
  }

  // Get all unique keys for solution picker
  const keys = new Set()
  for (const table of subTaskTables) {
    for (const key of Object.keys(table[0])) {
      keys.add(key)
    }
  }

  const variables = {}
  variables.subTaskTables = subTaskTables
  variables.keys = Array.from(keys.values())
  return variables
}

async function getSubtaskSolution (taskNr, subtaskNr) {
  const variables = {}
  const solutionClear = await db.getSolution(taskNr, subtaskNr, 'de')
  let solutionString = ''
  for (const part of solutionClear) {
    solutionString += (part.loesung + ';')
  }
  variables.solution = solutionString
  variables.solutionClear = solutionClear

  return variables
}

async function getFuncSolution (taskNr) {
  const variables = {}

  const solutionFuncDepClear = await db.getSolution(taskNr, 3, 'de')
  let solutionFuncDepString = ''
  for (const part of solutionFuncDepClear) {
    solutionFuncDepString += (part.loesung + ';')
  }
  variables.solutionFuncDepString = solutionFuncDepString

  for (const element of solutionFuncDepClear) {
    element.loesung = element.loesung.replace(/:/g, ': ').replace(/,/g, ', ')
  }

  variables.solutionFuncDepClear = solutionFuncDepClear

  return variables
}

async function getCompleteSolution (taskNr) {
  const variables = {}

  // Inefficient db call but much more readable code
  const solutionFuncDepClear = await db.getSolution(taskNr, 3, 'de')
  for (const element of solutionFuncDepClear) {
    element.loesung = element.loesung.replace(/:/g, ': ').replace(/,/g, ', ')
  }
  variables.solutionFuncDepClear = solutionFuncDepClear

  const solutionPKClear = await db.getSolution(taskNr, 4, 'de')
  let solutionStringPK = ''
  for (const part of solutionPKClear) {
    solutionStringPK += (part.loesung + ';')
  }

  for (const element of solutionPKClear) {
    element.loesung = element.loesung.replace(/;/g, '; ')
  }

  variables.solutionPKString = solutionStringPK
  variables.solutionPKClear = solutionPKClear

  const completeSolution = []
  const funcDep = variables.solutionFuncDepClear
  const pks = variables.solutionPKClear

  for (let i = 0; i < funcDep.length; i++) {
    const possiblePKS = funcDep[i].loesung.split(': ')[0].split(', ')
    let count = 0
    for (let a = 0; a < possiblePKS.length; a++) {
      for (let b = 0; b < pks.length; b++) {
        if (pks[b].loesung.localeCompare(possiblePKS[a]) === 0) {
          count = count + 1
        }
      }
    }

    if (count === pks.length) {
      completeSolution[i] = funcDep[i].loesung + ' → ' + 'voll'
    } else if (count === 0) {
      completeSolution[i] = funcDep[i].loesung + ' → ' + 'transitiv'
    } else {
      completeSolution[i] = funcDep[i].loesung + ' → ' + 'partiell'
    }
  }

  variables.completeSolution = completeSolution

  return variables
}

module.exports = {
  getTaskCount,
  getTasks,
  getTaskTable,
  getSubTaskTables,
  getSubtaskSolution,
  getFuncSolution,
  getCompleteSolution
}
