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

// Index Page
app.get('/', (req, res) => {
    // Variables for pug rendering
    let variables = {title: 'NF-Trainer', active_apps: true}

    // Render pug file at /views/3nf
    res.render(path + '3nf', variables)
})

/*
    Start Trainer
 */
app.post('/checkFirstNfTask', async (req, res) => {
    let variables = {title: 'NF-Trainer', active_apps: true}
    let currentSubtask = 1

    // Choose random taskNr
    let taskNr = getRandomInt(1, 8)
    req.session.taskNr = taskNr
    variables['task_nr'] = taskNr

    // Fill Variables
    variables['task'] = await db.getTask(taskNr, 'de')
    variables['subtask'] = await db.getSubtask(currentSubtask, 'de')
    let tasktable = await db.getTaskTable(taskNr, 0, 'de')
    variables['tasktable'] = tasktable
    variables['keys'] = Object.keys(tasktable[0])

    res.render(path + 'checkFirstNfTask', variables)
})

app.post('/markViolatingColumnsTask', async (req, res) => {
    let variables = {title: 'NF-Trainer', active_apps: true}
    let currentSubtask = 2

    if (!req.session.taskNr) {
        res.redirect('/')
    }
    let taskNr = req.session.taskNr

    // Skip Task since the table is already in 1NF
    if (req.body.firstNf === '1') {
        res.redirect(307, '/findFuncDepenTask')
    }

    // Fill Variables
    variables['task'] = await db.getTask(taskNr, 'de')
    variables['subtask'] = await db.getSubtask(currentSubtask, 'de')
    let tasktable = await db.getTaskTable(taskNr, 0, 'de')
    variables['tasktable'] = tasktable
    variables['keys'] = Object.keys(tasktable[0])
    let solutionClear = await db.getSolution(taskNr, currentSubtask, 'de')

    // Prepare Solution String
    let solutionString = ''
    for (let part of solutionClear) {
        solutionString += (part + ';')
    }
    variables['solution'] = solutionString
    variables['solutionClear'] = solutionClear

    res.render(path + 'markViolatingColumnsTask', variables)
})

app.post('/findFuncDepenTask', async (req, res) => {
    let variables = {title: 'NF-Trainer', active_apps: true}
    let currentSubtask = 3

    if (!req.session.taskNr) {
        res.redirect('/')
    }
    let taskNr = req.session.taskNr

    // Fill Variables
    variables['task'] = await db.getTask(taskNr, 'de')
    variables['subtask'] = await db.getSubtask(currentSubtask, 'de')
    let solutionClear = await db.getSolution(taskNr, currentSubtask, 'de')

    let tasktable
    if(taskNr === 2) {
        tasktable = await db.getTaskTable(taskNr, 1, 'de')
    } else {
        tasktable = await db.getTaskTable(taskNr, 0, 'de')
    }

    variables['tasktable'] = tasktable
    variables['keys'] = Object.keys(tasktable[0])

    // Prepare Solution String
    let solutionString = ''
    for (let part of solutionClear) {
        solutionString += (part + ';')
    }
    variables['solution'] = solutionString
    variables['solutionClear'] = solutionClear

    res.render(path + 'findFuncDepenTask', variables)
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