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
app.post('/checkFirstNfTask', async (req, res, next) => {
    let variables = {title: 'NF-Trainer', active_apps: true}

    // Choose random taskNr
    let taskNr = getRandomInt(1, 8)
    req.session.taskNr = taskNr
    variables['task_nr'] = taskNr

    // Fill Variables
    variables['task'] = await db.getTask(taskNr, 'de')
    variables['subtask'] = await db.getSubtask(taskNr, 'de')
    let tasktable = await db.getTaskTable(taskNr, 0, 'de')
    variables['tasktable'] = tasktable
    variables['keys'] = Object.keys(tasktable[0])

    res.render(path + 'checkFirstNfTask', variables)
})

app.post('/markViolatingColumnsTask', async (req, res, next) => {
    let variables = {title: 'NF-Trainer', active_apps: true}

    if (!req.session.taskNr) {
        res.redirect('/')
    }
    let taskNr = req.session.taskNr



    res.render(path + 'markViolatingColumnsTask', variables)
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