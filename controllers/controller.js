const {User, Profile, Comic, Type} = require('../models/index')
const bcrypt = require('bcryptjs')

class Controller {
    static loginPage(req, res) {
        console.log(req.query)

        let obj = {
            error: req.query.error
        }
        res.render('login', obj)
    }
    static login(req, res) {
        console.log(req.body)
        let {username, password} = req.body
        User.findOne({
            where: {username}
        })
        .then((data) => {
            if(data) {
                let userId = data.id
                let validate = bcrypt.compareSync(password, data.password)
                if(validate) {
                    req.session.userId = data.id
                    req.session.status = data.status
                    return res.redirect(`/home/${userId}`)
                } else {
                    const error = 'password or username wrong'
                    return res.redirect(`/?err=${error}`)
                }
            } else {
                const error = "You're not registered"
                return res.redirect(`/register?err=${error}`)
            }
        })
        .catch((err) => {
            res.send(err)
        })
        

    }
    static registerForm(req, res) {
        res.render('registerForm')
    }
    static register(req, res) {
        console.log(req.body)
        const {email, username, status, password} = req.body
        const createdAt = new Date()
        const updatedAt = new Date()
        User.create({
            username,
            email,
            password,
            status,
            createdAt,
            updatedAt
        })
        .then((data) => {
            res.redirect('/')
        })
        .catch((err) => {
            res.send(err)
        })   
    }
    static home(req, res) {
        User.findOne({
            where: {
                id: req.params.userId
            }
        })
        .then((dataUser) => {
            let obj = {
                dataUser,
                notif: req.query.notif
            }
            res.render('home', obj)
        })
    }
    static logout(req,res) {
        req.session.destroy((err) => {
            if(err) console.log(err)
            else {
                res.redirect('/')
            }
        })
    }
    static postComicForm(req, res) {
        User.findOne({
            where: {
                id:req.params.userId
            }
        })
        .then((dataUser) => {
            let obj = {
                dataUser
            }
            res.render('postComicForm', obj)
        })
    }
    static postComic(req, res) {
        console.log(req.body)
        const {title, imgUrl, type, synopsis} = req.body
        const createdAt = new Date()
        const updatedAt = new Date()
        Type.findOne({
            where: {
                name: type
            }
        })
        .then((type) => {

            return Comic.create({
                title,
                imgUrl,
                UserId: req.params.userId,
                TypeId: type.id,
                createdAt,
                updatedAt,
                synopsis
            })
        })
        .then((data) => {
            const notif="Your Comic posted successfully!"
            return res.redirect(`/home/${req.params.userId}/?notif=${notif}`)
        })
        .catch((err) => {
            res.send(err)
        })
    }
    static readComicList(req, res) {
        let dataComic

        Comic.findAll({
            include: [
                {
                    model: User
                },
                {
                    model: Type
                }
            ]
        })
        .then((data) => {
            dataComic = data
            return User.findOne({
                where: {
                    id: req.params.userId
                }
            })
        })
        .then((dataUser) => {
            console.log(dataComic)
            let obj ={
                dataComic,
                dataUser,
                userId: req.params.userId
            }
            res.render('comicList', obj)
        })
    }
}

module.exports = Controller