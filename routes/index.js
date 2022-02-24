const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const isLogin = require('../middleware/permission')
const upload = require('../middleware/multer.js')

router.get('/', Controller.loginPage)
router.post('/', Controller.login)
// router.get('/homee', Controller.homee)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

router.use(isLogin)

router.get('/logout', Controller.logout)

router.get('/dashboard', Controller.dashboard)

router.get('/delete/:ComicId', Controller.delete)
router.get('/edit/:ComicId', Controller.editForm)
router.post('/edit/:ComicId', upload.single('imgUrl'), Controller.submitEdit)

router.get('/postComic', Controller.postComicForm)

router.post('/postComic', upload.single('imgUrl'), Controller.postComic)

module.exports = router