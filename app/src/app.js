const express = require('express')
const cookieSession = require('cookie-session')
const bodyparser = require('body-parser')
const app = express()
const pugHelper = require('./pugHelper')

/*
    Server Configuration
 */

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
    maxAge: 24 * 60 * 60 * 1000 * 7, // 1 week
}))

/*
    Application Code
 */

// Helper Function
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    // TODO change maximum to variable
    req.session.taskNr = getRandomInt(1, 8)

    // Get necessary stuff from database
    let baseVariables = {title: 'NF-Trainer', active_apps: true}
    let taskVariables = await pugHelper.getTasks(req.session.taskNr, currentSubtask)
    let taskTableVariables = await pugHelper.getTaskTable(req.session.taskNr, currentSubtask)

    // Build pug-variables
    let variables = {...baseVariables, ...taskVariables, ...taskTableVariables}

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
        // Get necessary stuff from database
        let baseVariables = {title: 'NF-Trainer', active_apps: true}
        let taskVariables = await pugHelper.getTasks(req.session.taskNr, currentSubtask)
        let taskTableVariables = await pugHelper.getTaskTable(req.session.taskNr, currentSubtask)
        let solutionVariables = await pugHelper.getSubtaskSolution(req.session.taskNr, currentSubtask)

        // Build pug-variables
        let variables = {...baseVariables, ...taskVariables, ...taskTableVariables, ...solutionVariables}

        res.render(path + 'markViolatingColumnsTask', variables)
    }
})

app.post('/findFuncDepenTask', async (req, res) => {
    let currentSubtask = 3

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    // Get necessary stuff from database
    let baseVariables = {title: 'NF-Trainer', active_apps: true}
    let taskVariables = await pugHelper.getTasks(req.session.taskNr, currentSubtask)
    let taskTableVariables = await pugHelper.getTaskTable(req.session.taskNr, currentSubtask)
    let solutionVariables = await pugHelper.getSubtaskSolution(req.session.taskNr, currentSubtask)
    let funcDepVariables = await pugHelper.getFuncSolution(req.session.taskNr, currentSubtask)

    // Build pug-variables
    let variables = {...baseVariables, ...taskVariables, ...taskTableVariables, ...solutionVariables, ...funcDepVariables}

    res.render(path + 'findFuncDepenTask', variables)
})


app.post('/defPkTask', async (req, res) => {
    let currentSubtask = 4

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    // Get necessary stuff from database
    let baseVariables = {title: 'NF-Trainer', active_apps: true}
    let taskVariables = await pugHelper.getTasks(req.session.taskNr, currentSubtask)
    let taskTableVariables = await pugHelper.getTaskTable(req.session.taskNr, currentSubtask)
    let solutionVariables = await pugHelper.getSubtaskSolution(req.session.taskNr, currentSubtask)
    let funcDepVariables = await pugHelper.getFuncSolution(req.session.taskNr, currentSubtask)

    // Build pug-variables
    let variables = {...baseVariables, ...taskVariables, ...taskTableVariables, ...solutionVariables, ...funcDepVariables}

    res.render(path + 'defPkTask', variables)
})

app.post('/defFuncDepenTypeTask', async (req, res) => {
    let currentSubtask = 5

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await pugHelper.getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'defFuncDepenTypeTask', variables)
})

app.post('/defSecNfTask', async (req, res) => {
    let currentSubtask = 5

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await pugHelper.getPugVariables(req.session.taskNr, currentSubtask)

    res.render(path + 'defSecNfTask', variables)
})

app.post('/defThiNfTask', async (req, res) => {
    let currentSubtask = 6

    if (!req.session.taskNr) {
        res.redirect('/')
    }

    let variables = await pugHelper.getPugVariables(req.session.taskNr, currentSubtask)

    variables['targetPage'] = '/lastPage'

    res.render(path + 'defThiNfTask', variables)
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