const User = require('../models/user');
exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
    console.log(req.session);
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
}

exports.postLogout = (req, res, next) => {
    res.redirect("/");
}