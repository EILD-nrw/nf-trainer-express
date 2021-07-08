const express = require('express')
const cookieSession = require('cookie-session')
const bodyparser = require('body-parser')
const app = express()
const service = require('./nf_services')
const path = require('path')

/*
    Server Configuration
 */

const viewPath = path.join(__dirname, 'views')

// Use pug
app.set('view engine', 'pug')

// Handle static css and js files automatically
app.use(express.static(__dirname))

// Parse Post-Body
app.use(bodyparser.urlencoded({ extended: true }))

// Use cookies to store taskNr
app.use(cookieSession({
  name: 'session',
  secret: 'nf_secret',
  maxAge: 24 * 60 * 60 * 1000 * 7 // 1 week
}))

/*
    Application Code
 */

// Helper Function
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function getRandomTask () {
  const maxTask = await service.getTaskCount()
  return getRandomInt(1, maxTask)
}

// Index Page
app.get(['/', '/index'], (req, res) => {
  // Render pug file at /views/3nf
  res.render(path.join(viewPath, '3nf'), {})
})

/*
    Start Trainer
 */
app.post('/checkFirstNfTask', async (req, res, next) => {
  try {
    const currentSubtask = 1

    // Save targetNF in Session
    req.session.targetNF = req.body.targetNF

    // Choose random taskNr
    req.session.taskNr = await getRandomTask()

    // Get necessary stuff from database
    const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
    const taskTableVariables = await service.getTaskTable(req.session.taskNr, currentSubtask)

    // Build pug-variables
    const variables = { task_nr: req.session.taskNr, ...taskVariables, ...taskTableVariables }

    res.render(path.join(viewPath, 'checkFirstNfTask'), variables)
  } catch (err) {
    next(err)
  }
})

app.post('/markViolatingColumnsTask', async (req, res, next) => {
  try {
    const currentSubtask = 2

    if (!req.session.taskNr) {
      res.redirect('/')
    }

    // Skip Task since the table is already in 1NF
    if (req.session.taskNr !== 2) {
      res.redirect(307, '/findFuncDepenTask')
    } else {
      // Get necessary stuff from database
      const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
      const taskTableVariables = await service.getTaskTable(req.session.taskNr, currentSubtask)
      const solutionVariables = await service.getSubtaskSolution(req.session.taskNr, currentSubtask)

      // Build pug-variables
      const variables = { task_nr: req.session.taskNr, ...taskVariables, ...taskTableVariables, ...solutionVariables }

      res.render(path.join(viewPath, 'markViolatingColumnsTask'), variables)
    }
  } catch (err) {
    next(err)
  }
})

app.post('/findFuncDepenTask', async (req, res, next) => {
  try {
    const currentSubtask = 3

    if (!req.session.taskNr) {
      res.redirect('/')
    }

    // Get necessary stuff from database
    const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
    const taskTableVariables = await service.getTaskTable(req.session.taskNr, currentSubtask)
    const solutionVariables = await service.getSubtaskSolution(req.session.taskNr, currentSubtask)
    const funcDepVariables = await service.getFuncSolution(req.session.taskNr)

    // Build pug-variables
    const variables = { task_nr: req.session.taskNr, ...taskVariables, ...taskTableVariables, ...solutionVariables, ...funcDepVariables }

    res.render(path.join(viewPath, 'findFuncDepenTask'), variables)
  } catch (err) {
    next(err)
  }
})

app.post('/defPkTask', async (req, res, next) => {
  try {
    const currentSubtask = 4

    if (!req.session.taskNr) {
      res.redirect('/')
    }

    // Get necessary stuff from database
    const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
    const taskTableVariables = await service.getTaskTable(req.session.taskNr, currentSubtask)
    const solutionVariables = await service.getSubtaskSolution(req.session.taskNr, currentSubtask)
    const funcDepVariables = await service.getFuncSolution(req.session.taskNr)

    // Build pug-variables
    const variables = { task_nr: req.session.taskNr, ...taskVariables, ...taskTableVariables, ...solutionVariables, ...funcDepVariables }

    res.render(path.join(viewPath, 'defPkTask'), variables)
  } catch (err) {
    next(err)
  }
})

app.post('/defFuncDepenTypeTask', async (req, res, next) => {
  try {
    const currentSubtask = 5

    if (!req.session.taskNr) {
      res.redirect('/')
    }

    // Get necessary stuff from database
    const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
    const taskTableVariables = await service.getTaskTable(req.session.taskNr, currentSubtask)
    const solutionVariables = await service.getSubtaskSolution(req.session.taskNr, currentSubtask)
    const funcDepVariables = await service.getFuncSolution(req.session.taskNr)
    const pkSolutionVariables = await service.getCompleteSolution(req.session.taskNr)

    // Build pug-variables
    const variables = { task_nr: req.session.taskNr, ...taskVariables, ...taskTableVariables, ...solutionVariables, ...funcDepVariables, ...pkSolutionVariables }

    res.render(path.join(viewPath, 'defFuncDepenTypeTask'), variables)
  } catch (err) {
    next(err)
  }
})

app.post('/defSecNfTask', async (req, res, next) => {
  try {
    const currentSubtask = 5

    if (!req.session.taskNr) {
      res.redirect('/')
    }

    // Get necessary stuff from database
    const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
    const taskTableVariables = await service.getTaskTable(req.session.taskNr, currentSubtask)
    const solutionVariables = await service.getSubtaskSolution(req.session.taskNr, currentSubtask)
    const funcDepVariables = await service.getFuncSolution(req.session.taskNr)
    const pkSolutionVariables = await service.getCompleteSolution(req.session.taskNr)

    // Build pug-variables
    const variables = { task_nr: req.session.taskNr, ...taskVariables, ...taskTableVariables, ...solutionVariables, ...funcDepVariables, ...pkSolutionVariables }

    res.render(path.join(viewPath, 'defSecNfTask'), variables)
  } catch (err) {
    next(err)
  }
})

app.post('/defThiNfTask', async (req, res, next) => {
  try {
    const currentSubtask = 6

    if (!req.session.taskNr) {
      res.redirect('/')
    }

    // Get necessary stuff from database
    const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
    const subTaskTableVariables = await service.getSubTaskTables(req.session.taskNr, currentSubtask, 2)
    const solutionVariables = await service.getSubtaskSolution(req.session.taskNr, currentSubtask)
    const funcDepVariables = await service.getFuncSolution(req.session.taskNr)
    const pkSolutionVariables = await service.getCompleteSolution(req.session.taskNr)

    // Build pug-variables
    const variables = { task_nr: req.session.taskNr, ...taskVariables, ...subTaskTableVariables, ...solutionVariables, ...funcDepVariables, ...pkSolutionVariables }

    // Continue to results if targetNF is 3nf
    if (req.session.targetNF === 'bcnf') {
      variables.targetPage = '/checkBCNfTask'
    } else {
      variables.targetPage = '/lastPage'
    }

    res.render(path.join(viewPath, 'defThiNfTask'), variables)
  } catch (err) {
    next(err)
  }
})

app.post('/checkBCNfTask', async (req, res, next) => {
  try {
    const currentSubtask = 7

    if (!req.session.taskNr) {
      res.redirect('/')
    }

    // Get necessary stuff from database
    const taskVariables = await service.getTasks(req.session.taskNr, currentSubtask)
    const subTaskTableVariables = await service.getSubTaskTables(req.session.taskNr, currentSubtask, 3)
    const solutionVariables = await service.getSubtaskSolution(req.session.taskNr, currentSubtask)
    const funcDepVariables = await service.getFuncSolution(req.session.taskNr)
    const pkSolutionVariables = await service.getCompleteSolution(req.session.taskNr)

    // Build pug-variables
    const variables = { task_nr: req.session.taskNr, ...taskVariables, ...subTaskTableVariables, ...solutionVariables, ...funcDepVariables, ...pkSolutionVariables }

    res.render(path.join(viewPath, 'checkBCNfTask'), variables)
  } catch (err) {
    next(err)
  }
})

app.post('/lastPage', async (req, res) => {
  res.render(path.join(viewPath, 'lastPage'), {})
})

// Simple error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.render(path.join(viewPath, '500'), { error: err })
})

// Start server
app.listen(8080, () => {
  console.log('Server listening at http://localhost:8080/')
})

// Handle Shutdown
process.on('SIGINT', () => {
  console.log('Exiting application')
  process.exit(0)
})
