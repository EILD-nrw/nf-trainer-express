const express = require('express')
const cookieSession = require('cookie-session')
const app = express()
const db = require('./database')

let path = __dirname + '/views/'

// Use pug
app.set('view engine', 'pug')

// Handle static css and js files automatically
app.use(express.static(__dirname))

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

// Start Trainer
app.post('/checkFirstNfTask', (req, res, next) => {
    let variables = {title: 'NF-Trainer', active_apps: true}
    let done = () => res.render(path + 'checkFirstNfTask', variables)

    let counter = 0
    let number_functions = 3

    // getTask
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