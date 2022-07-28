const express = require('express')
const cors = require ('cors')
const path = require('path')

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: 'f9c87df1da744929873a02fc91682385',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

const app = express()

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use(express.static(path.join(__dirname,'../public')))

app.use(express.json())

const cars = ['ICEEZ', 'SUNO', 'ALYZE']


app.get('/api/cars', (req, res) => {
    rollbar.info("Cars was requested", cars)
    res.status(200).send(cars)
})

app.post('/api/cars', (req, res) => {
   let {name} = req.body

   const index = cars.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           cars.push(name)

           rollbar.info("A new car was created", name)

           res.status(200).send(cars)
       } else if (name === ''){
            rollbar.error("A car was posted without a name")
            res.status(400).send('You must enter a name.')
       } else if(name === '1'){
            rollbar.warning("A car was posted with a space only")
            res.status(400).send('You must enter a name.')
       }
       else {
            rollbar.critical("A car that already exists was posted", name)
            res.status(400).send('That Car name already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})


const port = process.env.PORT || 4005

app.use(rollbar.errorHandler())

app.listen(port, () => {console.log(`Listening on port ${port}`)})