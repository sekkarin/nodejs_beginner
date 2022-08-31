const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const AuthRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//! ฝั่งขอมูลผู้ใช้ในตอนเริ่มต้น
app.use((req, res, next) => {
  User.findById('62fcba1c4b0f764d201c6684')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(AuthRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb://localhost:27017/shop'
  )
  .then(result => {
    User.findOne().then(user => {
        if (!user) {
          const user = new User({
            name: 'Ken',
            email: 'admin@admin.com',
            cart: {
              items: []
            }
          });
          user.save();
        }
      });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
