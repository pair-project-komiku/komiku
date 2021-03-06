const { User, Profile, Comic, Type } = require('../models/index')
const bcrypt = require('bcryptjs')
const changeText = require('../helpers/type.js')
const e = require('express')

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
                // res.redirect('/')
                console.log(data.id)
                res.redirect(`/createProfile?id=${data.id}`)
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
        // console.log(req.body)
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
        .catch((err) => {
            res.send(err)
        })
    }
    static dashboard(req, res) {
        User.findOne({
            include: [
                {
                    model: Comic
                },
                {
                    model: Profile
                }
            ],
            where: {
                id: req.session.userId
            }
        })
            .then((data) => {
                let obj = {
                    data,
                    changeText,
                    notif: req.query.notif
                }
                // console.log(data)
                res.render('dashboard', obj)
            })
    }

    static explore(req, res) {
        // console.log(req.query)
        // console.log(req.query.order)
        let order = 'DESC';
        if (req.query.order) {
            order = req.query.order
        }
        User.findOne({
            where: {
                id: req.session.userId
            }
        })
            .then((user) => {
                if (user.status === 'Premium') {
                    Comic.findAll({
                        include: User,
                        order: [['updatedAt', order]]
                    })
                        .then((data) => {
                            res.render('explore', { data, changeText })
                        })
                        .catch((err) => {
                            res.send(err)
                        })
                } else {
                    Comic.findAll({
                        include: User,
                        where: {
                            TypeId: 1
                        },
                        order: [['updatedAt', order]],
                    })
                        .then((data) => {
                            res.render('explore', { data, changeText })
                        })
                        .catch((err) => {
                            res.send(err)
                        })
                }
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static profileSettingForm(req, res) {
        // console.log(req.params.UserId)
        Profile.findOne({
            where: {
                UserId: req.params.UserId
            }
        })
        .then((data) => {
            res.render('profileSettingForm', {data})
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