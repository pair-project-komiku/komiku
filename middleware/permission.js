const isLogin = (req, res, next) => {
    if (!req.session.userId) {
        const error = "You need to Login first!"
        res.redirect(`/?error=${error}`)
    } else {
        next()
    }
}

module.exports = isLogin