const User = require('../models/user');
const bcrypt = require('bcryptjs')
exports.getLogin = (req, res, next) => {
    const message = req.flash('error')[0]
    console.log(message);
    // if (message.length>0){
    //     message = message[0]
    // }
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage:message
        // isAuthenticated: isLoggedIn,
    });
};
exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error','Invalid email or password')
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true
                    req.session.user = user
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/')
                    })
                }
                req.flash('error','Invalid email or password')
                res.redirect('/login')
            }).catch(err => {
                    console.log(err);
                    
                    res.redirect('/login')
                }
            )
        }).catch(err => console.log(err))


}


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/')
    });
}
exports.postSignup = (req, res, next) => {

    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    const confirmPassword = req.body.confirmPassword
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12)
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