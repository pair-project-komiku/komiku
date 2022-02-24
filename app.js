const express = require('express')
const app = express()
const router = require('./routes/index')
const session = require('express-session')
const port = 3000
const multer  = require('multer')


app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: 'kepo luuh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true  //untuk security csrf attack
    }
  }))

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname);
    },
});

const upload = multer({ storage: fileStorageEngine });

app.post('/single', upload.single('image'), (req, res) => {
    console.log(req.file)
    res.send('file upload success')
})

app.use('/', router)

app.listen(port, () => {
    console.log('This app is running at port: ', port)
})