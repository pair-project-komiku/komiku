const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const {isLogin, isPremium} = require('../middleware/permission')
const upload = require('../middleware/multer.js')

router.get('/', Controller.loginPage)
router.post('/', Controller.login)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

router.use(isLogin)

router.get('/logout', Controller.logout)


router.get('/home/:userId', Controller.home)

router.get('/postComic/:userId', Controller.postComicForm)

router.post('/postComic/:userId', upload.single('imgUrl') , Controller.postComic)

module.exports = router