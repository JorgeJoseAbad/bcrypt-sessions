var express = require('express');
var router = express.Router();

const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', function(req, res, next) {
  let myUsername;
  if (req.session.currentUser != undefined){
    myUsername = req.session.currentUser.username;
  } else myUsername = "anonimous"
  res.render('index', {
    title: 'Express',
    username: myUsername
  });
});

router.get('/logout', function(req, res, next) {
  req.session.currentUser = null
  res.redirect('/')
});

router.get('/register', function(req, res, next) {
  if (req.session.currentUser) {
    return res.send(`You ${req.session.currentUser.username} are already logged`);
  }

  res.render('auth-user', {
    header: 'New register of user',
    action: '/register',
    buttonText: 'Register',
    error: false
  });
});

router.post('/register', function(req, res, next) {
  const username = req.body.username
  const password = req.body.password
  const saltRounds = 10

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) return next(err)
    const user = new User({username, hash})

    user.save(function(err, doc) {
      if (err) return next(err)
      res.redirect('/login')
    })
  })
});

router.get('/login', function(req, res, next) {
  res.render('auth-user', {
    header: 'Login a new secure user',
    action: '/login',
    buttonText: 'Login',
    error: false
  });
})

router.post('/login', function(req, res, next) {
  const username = req.body.username
  const password = req.body.password

  User.findOne({username: username}, function(err, user) {
    if (err) return next(err)

    if ( user == null ){
      res.render('auth-user', {
        header: 'User invalid',
        action: '/login',
        buttonText: 'Login',
        error: true
      });
    } else {
      const hash = user.hash

      bcrypt.compare(password, hash, function(err, isValid) {
        if (err) return next(err)

        if (!isValid) {
          res.render('auth-user', {
            header: 'Login with a correct password',
            action: '/login',
            buttonText: 'Login',
            error: true
          });
        }
        else {
          let fakeData = {
            dataOne: "hola",
            dataTwo: 2
          }
          req.session.currentUser = user;
          req.session.data = fakeData;
          res.redirect("/user")

        }
      })
    }
  })
});


module.exports = router;
