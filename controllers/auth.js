const User = require('../models/user');
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
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const confirmPassword = req.body.confirmPassword
    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
            return res.redirect('/signup')
        }
        const user = new User({
            name:name,
            email:email,
            password:password,
            cart:{items:[]}
        })
        return user.save()
    })
    .thent(result=>{
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