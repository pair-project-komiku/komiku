const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')

router.get('/', Controller.loginPage)
router.post('/', Controller.login)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)
router.get('/home', Controller.home)


// router.get('/register', Controller.registerForm)
// router.get('/login', Controller.loginForm)


module.exports = router