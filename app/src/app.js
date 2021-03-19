const express = require('express')
const cookieSession = require('cookie-session')
const bodyparser = require('body-parser')
const app = express()
const db = require('./database')

let path = __dirname + '/views/'

// Use pug
app.set('view engine', 'pug')

// Handle static css and js files automatically
app.use(express.static(__dirname))

// Parse Post-Body
app.use(bodyparser.urlencoded({extended: true}))

// Use cookies to store taskNr
app.use(cookieSession({
    name: 'session',
    secret: 'nf_secret',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
}))

/*
    Application Code
 */

// Helper Function
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getTasks(taskNr, subtaskNr) {
    let variables = {}
    variables['task'] = await db.getTask(taskNr, 'de')
    variables['subtask'] = await db.getSubtask(subtaskNr, 'de')

    return variables
}

async function getTaskTable(taskNr, subtaskNr) {
    let variables = {}

    let tasktable
    // Task 2 is not in 1NF and gets another table
    if (taskNr === 2 && subtaskNr >= 2) {
        tasktable = await db.getTaskTable(taskNr, 1, 'de')
    } else {
        tasktable = await db.getTaskTable(taskNr, 0, 'de')
    }
    variables['tasktable'] = tasktable
    variables['keys'] = Object.keys(tasktable[0])

    return variables
}

async function getFirstSolution(taskNr, subtaskNr) {
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

async function getSolutionVariables(taskNr, subtaskNr) {
    let solutionVariables = await getFirstSolution(taskNr, subtaskNr)

    // Tasks 1-2 dont need functional dependencies or primary keys
    if (subtaskNr < 3) return solutionVariables

    let funcVariables = await getFuncSolution(taskNr)
    solutionVariables = {...solutionVariables, ...funcVariables}

    // Tasks 3-4 dont need primary keys
    if (subtaskNr < 5) return solutionVariables

    let completeSolutionVariables = await getCompleteSolution(taskNr)
    solutionVariables = {...solutionVariables, ...completeSolutionVariables}

    return solutionVariables
}

async function getPugVariables(taskNr, subtaskNr) {
    // Variables Base
    let variables = {title: 'NF-Trainer', active_apps: true}
    variables['task_nr'] = taskNr

    // Add Tasks
    let taskVariables = await getTasks(taskNr, subtaskNr)
    variables = {...variables, ...taskVariables}

    // Add TaskTable
    let taskTableVariables = await getTaskTable(taskNr, subtaskNr)
    variables = {...variables, ...taskTableVariables}

    // The first task does not need an additional solution
    if (subtaskNr < 2) return variables

    // Add Solution
    let solutionVariables = await getSolutionVariables(taskNr, subtaskNr)
    variables = {...variables, ...solutionVariables}

    return variables
}

// Index Page
app.get(['/', '/index'], (req, res) => {
    // Variables for pug rendering
    let variables = {title: 'NF-Trainer', active_apps: true}

    // Render pug file at /views/3nf
    res.render(path + '3nf', variables)
})

/*
    Start Trainer
 */
app.post('/checkFirstNfTask', async (req, res) => {
    let currentSubtask = 1

    // Save targetNF in Session
    req.session.targetNF = req.body.targetNF

    // Choose random taskNr
    req.session.taskNr = getRandomInt(1, 8)

    let variables = await getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'checkFirstNfTask', variables)
})

app.post('/markViolatingColumnsTask', async (req, res) => {
    let currentSubtask = 2

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    // Skip Task since the table is already in 1NF
    if (req.session.taskNr !== 2) {
        res.redirect(307, '/findFuncDepenTask')
    } else {
        let variables = await getPugVariables(req.session.taskNr, currentSubtask)
        res.render(path + 'markViolatingColumnsTask', variables)
    }
})

app.post('/findFuncDepenTask', async (req, res) => {
    let currentSubtask = 3

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'findFuncDepenTask', variables)
})


app.post('/defPkTask', async (req, res) => {
    let currentSubtask = 4

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'defPkTask', variables)
})

app.post('/defFuncDepenTypeTask', async (req, res) => {
    let currentSubtask = 5

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'defFuncDepenTypeTask', variables)
})

app.post('/defSecNfTask', async (req, res) => {
    let currentSubtask = 5

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'defSecNfTask', variables)
})

app.post('/defThiNfTask', async (req, res) => {
    let currentSubtask = 6

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await getPugVariables(req.session.taskNr, currentSubtask)

    // Continue to results if targetNF is 3nf
    if (req.session.targetNF === 'bcnf') {
        variables['targetPage'] = '/checkBCNfTask'
    } else {
        variables['targetPage'] = '/lastPage'
    }

    res.render(path + 'defThiNfTask', variables)
})

app.post('/checkBCNfTask', async (req, res) => {
    let currentSubtask = 7

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'checkBCNfTask', variables)
})

app.post('/lastPage', async (req, res) => {
    let variables = {title: 'NF-Trainer', active_apps: true}

    res.render(path + 'lastPage', variables)
})

// Start server
app.listen(8080, () => {
    console.log(`Server listening at http://localhost:8080/`)
})

// Handle Shutdown
process.on('SIGINT', () => {
    console.log('Exiting application')
    process.exit(0)
})