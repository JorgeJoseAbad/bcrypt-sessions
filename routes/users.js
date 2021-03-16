var express = require('express');
var router = express.Router();

const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/',function(req,res,next) {
  debugger;
  res.render('user', {
    title: 'User page',
    user: req.session.currentUser.username,
    campo: req.session.data.campo1
  });
})

module.exports = router;
