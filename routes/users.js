var express = require('express');
var router = express.Router();

const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/',function(req,res,next) {

  res.render('user', {
    title: 'User page',
    user: req.session.currentUser.username,
    dataOne: req.session.data.dataOne,
    dataTwo: req.session.data.dataTwo
  });
})

module.exports = router;
