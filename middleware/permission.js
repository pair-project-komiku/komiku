const isLogin = (req, res, next) => {
    if (!req.session.userId) {
        const error = "You need to Login first!"
        res.redirect(`/?error=${error}`)
    } else {
        next()
    }
}

const isPremium = (req, res, next) => {
    if(req.session.status !== 'Premium') {
        const error = "You don't have permission!"
        res.redirect(`/?error=${error}`)
    } else {
        next()
    }
}

module.exports= {isLogin, isPremium}