/**
 * Created by Maples7 on 2016/3/28.
 */

const UPLOAD_DIR = './public/upload/';

var fs = require('fs');
var Promise = require('bluebird');
var markdown = require('markdown').markdown;
var User = require('../models/user.js');

var edit_get = function (req, res) {
  res.render('edit', {
    title: '修改用户信息',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};

var edit_post = function (req, res) {
  Promise.try(function () {
    var current_user = req.session.user;
    var old_name = current_user.name;
    var body = req.body;
    var new_name = body.name && body.name.trim();
    var email = body.email && body.email.trim();
    var intro = body.intro && body.intro.trim();
    var new_head_pic = req.files;
    var old_head_pic = current_user.head_pic;

    if (!new_name || !email || !intro) {
      return Promise.reject('请填完整所有带*字段');
    }
    if (Object.keys(new_head_pic).length === 0) {
      new_head_pic = old_head_pic;
    } else {
      new_head_pic = new_head_pic.pic.name;
    }

    return User.findOne({name: new_name}).then(function (user) {
      if (user && user.name != old_name) {
        return Promise.reject('该用户名已被占用！');
      }
    }).then(function () {
      return User.findOneAndUpdate({name: old_name}, {
        $set: {
          name: new_name,
          email: email,
          intro: intro,
          head_pic: new_head_pic
        }
      }).exec(function (err) {
        if (err) {
          return Promise.reject(err.message);
        }

        current_user.name = new_name;
        current_user.email = email;
        current_user.intro = intro;
        current_user.head_pic = new_head_pic;

        if (new_head_pic !== old_head_pic) {
          fs.unlink(UPLOAD_DIR + old_head_pic, function (err) {
            if (err) {
              req.flash('error', '删除旧头像失败： ' + err.message);
            }
          });
        }
      }).return('修改成功！');
    });
  }).then(function (message) {
    req.flash('success', message);
    return res.redirect('/');
  }, function (err) {
    req.flash('error', err);
    if (req.files.pic) {
      fs.unlink(UPLOAD_DIR + req.files.pic.name, function (err) {
        if (err) throw (err);
      });
    }
    return res.redirect('/edit');
  }).catch(function (err) {
    req.flash('error', '删除已上传头像失败： ' + err.message);
    return res.redirect('/');
  });
};

var user_get = function (req, res) {
  User.findOne({name: req.params.name}).exec().then(function (user) {
    if (!user) {
      throw new Error('用户不存在！');
    }
    user.intro = markdown.toHTML(user.intro);
    res.render('user', {
      title: '用户信息： ' + user.name,
      view_user: user,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  }).catch(function (err) {
    req.flash('error', err.message);
    return res.redirect('/');
  });
};

module.exports = {
  edit_get: edit_get,
  edit_post: edit_post,
  user_get: user_get
}
