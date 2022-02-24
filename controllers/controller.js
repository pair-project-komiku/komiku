const {User} = require('../models/index')
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
                    return res.redirect(`/home`)
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
        res.render('home')
    }
}

module.exports = Controller