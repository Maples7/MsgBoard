/**
 * Created by Maples7 on 2016/3/28.
 */

var cryto = require('crypto');
var User = require('../models/user.js');

var login_get = function (req, res) {
  res.render('login', {
    title: '登录',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};

var login_post = function (req, res) {
  var password = cryto.createHash('md5').update(req.body.password).digest('hex');

  User.findOne({name: req.body.name}).exec().then(function (user) {
    if (!user) throw new Error('用户不存在！');
    if (user.password !== password) throw new Error('密码错误！');
    req.session.user = user;
    return '登录成功！';
  }).then(function (message) {
    req.flash('success', message);
    return res.redirect('/');
  }).catch(function (err) {
    req.flash('error', err.message);
    return res.redirect('/login');
  });
};

var logout_get = function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功！');
  return res.redirect('/');
}

module.exports = {
  login_get: login_get,
  login_post: login_post,
  logout_get: logout_get
};
