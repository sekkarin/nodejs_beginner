const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require('./models/user');
//* https://github.com/expressjs/session
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const MONGODB_URI = 'mongodb://localhost:27017/shop'

const app = express();

var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
store.on('error', function(error) {
  console.log(error);
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const AuthRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(require('express-session')({
  secret: 'This is a secret',
  // cookie: {
  //   maxAge: 100000 // 1 week
  // },
  store: store,
  resave: true,
  saveUninitialized: true
}));


//! ฝั่งขอมูลผู้ใช้ในตอนเริ่มต้น
app.use((req, res, next) => {
  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id)
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
    MONGODB_URI
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
