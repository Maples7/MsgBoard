/**
 * Created by Maples7 on 2016/3/28.
 */

const UPLOAD_DIR = './public/upload/';

var fs = require('fs');
var crypto = require('crypto');
var Promise = require('bluebird');
var User = require('../models/user.js');

var reg_get = function (req, res) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};

var reg_post = function (req, res) {
  Promise.try(function () {
    var body = req.body;
    var name = body.name && body.name.trim();
    var password = body.password && body.password.trim();
    var password_re = body['password-repeat'] && body['password-repeat'].trim();
    var email = body.email && body.email.trim();
    var intro = body.intro && body.intro.trim();
    var head_pic = req.files.pic;  // Object: prevent an empty object do not have property

    if (password_re !== password) {
      return Promise.reject('两次输入的密码不一致！');
    }
    if (!name || !password || !password_re || !email || !intro || !head_pic) {
      return Promise.reject('请填完整所有带*字段！');
    }

    head_pic = head_pic.name;     // String

    var password = crypto.createHash('md5').update(password).digest('hex');

    var newUser = new User({
      name: name,
      password: password,
      email: email,
      intro: intro,
      head_pic: head_pic
    });

    return User.findOne({name: newUser.name}).then(function (user) {
      if (user) {
        return Promise.reject('用户已存在！');
      }
      return newUser.saveAsync().return('注册成功！请登录。');
    });
  }).then(function (message) {
    req.flash('success', message);
    return res.redirect('/login');
  }, function (err) {
    req.flash('error', err);
    if (req.files.pic) {
      fs.unlink(UPLOAD_DIR + req.files.pic.name, function (err) {
        if (err) throw err;
      });
    }
    return res.redirect('/reg');
  }).catch(function (err) {
    re.flash('error', '删除已上传图片失败： ' + err.message);
    return res.redirect('/login');
  });
};

module.exports = {
  reg_get: reg_get,
  reg_post: reg_post
};
