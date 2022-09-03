const User = require('../models/user');
const bcrypt = require('bcryptjs')
exports.getLogin = (req, res, next) => {

    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: req.session.isLoggedIn,
        // isAuthenticated: isLoggedIn,
    });
};
exports.postLogin = (req, res, next) => {

    User.findById('62fcba1c4b0f764d201c6684')
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user
            res.redirect("/")
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/')
    });
}
exports.postSignup = (req, res, next) => {
    console.log("sign up");
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    console.log(`${email} , ${password} , ${name}`);
    const confirmPassword = req.body.confirmPassword
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12)

        })
        .then(hashPwd => {
            const user = new User({
                name: name,
                email: email,
                password: hashPwd,
                cart: { items: [] }
            })
            return user.save()
        }

        )
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => console.log(err))
}
exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    })
}