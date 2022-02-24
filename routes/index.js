const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const {isLogin, isPremium} = require('../middleware/permission')

router.get('/', Controller.loginPage)
router.post('/', Controller.login)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

router.use(isLogin)

router.use(isPremium)


router.get('/home', Controller.home)


// router.get('/register', Controller.registerForm)
// router.get('/login', Controller.loginForm)


module.exports = router