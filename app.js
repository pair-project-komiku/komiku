const express = require('express')
const app = express()
const router = require('./routes/index')
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))
app.use('/assets', express.static('assets'))

app.use(session({
    secret: 'kepo luuh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true  //untuk security csrf attack
    }
  }))

app.use('/', router)

app.listen(port, () => {
    console.log('This app is running at port: ', port)
})