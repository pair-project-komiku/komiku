const { User, Profile, Comic, Type } = require('../models/index')
const bcrypt = require('bcryptjs')

class Controller {
    static loginPage(req, res) {
        // console.log(req.query)

        let obj = {
            error: req.query.error,
            notif: req.query.notif
        }
        res.render('login', obj)
    }
    static login(req, res) {
        // console.log(req.body)
        let { username, password } = req.body
        User.findOne({
            where: { username }
        })
            .then((data) => {
                if (data) {
                    let userId = data.id
                    let validate = bcrypt.compareSync(password, data.password)
                    if (validate) {
                        req.session.userId = data.id
                        res.redirect(`/dashboard`)
                    } else {
                        const error = 'password or username wrong'
                        res.redirect(`/?err=${error}`)
                    }
                } else {
                    const error = "You're not registered"
                    res.redirect(`/register?err=${error}`)
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
        // console.log(req.body)
        const { email, username, status, password } = req.body
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
                console.log(data)
                res.redirect(`/createProfileForm?id=${data.id}`)
            })
            .catch((err) => {
                res.send(err)
            })
    }
    static createProfileForm(req, res) {
        const id = req.query.id
        res.render('createProfileForm', {id})
    }
    static createProfile(req, res) {
        const {alias, biodata} = req.body
        console.log(req.body)
        const UserId = req.query.id
        const createdAt = new Date()
        const updatedAt = new Date()
        Profile.create({
            alias,
            biodata,
            UserId,
            createdAt,
            updatedAt
        })
        .then((data) => {
            const notif = "Profile created"
            res.redirect(`/?notif=${notif}`)
        })
    }
    static dashboard(req, res) {
        User.findOne({
            include: Comic,
            where: {
                id: req.session.userId
            }
        })
            .then((data) => {
                let obj = {
                    data,
                    notif: req.query.notif
                }
                res.render('dashboard', obj)
            })
    }
    static profileSettingForm(req, res) {
        Profile.findOne({
            where: {
                id: req.session.userId
            }
        })
        .then((data) => {
            res.render('profileSettingForm', {data})
        })
    }
    static profileSettingUpdate(req, res) {
        const {alias, biodata} = req.body
        const UserId = req.session.userId
        const updatedAt = new Date()
        console.log(req.body)
        Profile.update(
            {
                alias,
                biodata,
                UserId,
                updatedAt
            },
            {
                where: {
                    id: req.query.id
                }
            }
        )
        .then((data) => {
            const notif = 'Profile updated'
            res.redirect(`/dashboard?notif=${notif}`)
        })
        .catch((err) => {
            res.send(err)
        })
    }
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) console.log(err)
            else {
                res.redirect('/')
            }
        })
    }
    static postComicForm(req, res) {
        User.findOne({
            where: {
                id: req.session.userId
            }
        })
            .then((data) => {
                let obj = {
                    data
                }
                res.render('postComicForm', obj)
            })
    }

    static postComic(req, res) {
        // console.log(req.body)
        const UserId = req.session.userId
        const { title, TypeId, synopsis } = req.body
        const imagePath = req.file.path
        const newComic = {
            title: title,
            imgUrl: imagePath,
            UserId: UserId,
            TypeId: TypeId,
            synopsis: synopsis
        }
        Comic.create(newComic)
            .then((data) => {
                //  const notif = "Your Comic posted successfully!"
                res.redirect(`/dashboard`)
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static editForm(req, res) {
        // console.log(req.params)
        const comicId = req.params.ComicId;
        Comic.
            findOne({
                where: {
                    id: comicId
                }
            })
            .then((data) => {
                res.render('editForm', { data })
            })
    }

    static submitEdit(req, res) {
        const { title, TypeId, synopsis } = req.body
        if (!req.file) {
            Comic.
                update({
                    title: title,
                    TypeId: TypeId,
                    synopsis: synopsis
                },
                    {
                        where: {
                            id: req.params.ComicId
                        }
                    })
                .then(() => {
                    res.redirect('/dashboard')
                })
                .catch((err) => {
                    res.send(err)
                })
        } else {
            Comic.
                update({
                    title: title,
                    TypeId: TypeId,
                    synopsis: synopsis,
                    imgUrl: req.file.path
                },
                    {
                        where: {
                            id: req.params.ComicId
                        }
                    })
                .then(() => {
                    res.redirect('/dashboard')
                })
                .catch((err) => {
                    res.send(err)
                })
        }
    }

    static delete(req, res) {
        const comicId = req.params.ComicId;
        Comic.
            destroy({
                where: {
                    id: comicId
                }
            })
            .then(() => {
                res.redirect('/dashboard')
            })
            .catch((err) => {
                res.send(err)
            })

    }
}

module.exports = Controller