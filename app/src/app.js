const express = require('express'),
    app = express()

let path = __dirname + '/views/'

const app = express()

app.use(express.static(__dirname))

// Get using asynchronous function to avoid callbacks
app.get('/', async (req, res) => {
    let client =  await pool.connect()
    let { rows } = await client.query('SELECT NOW()')
    res.send(rows[0])
    client.release()
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