/**
 * Created by Maples7 on 2016/3/28.
 */

var mongoose = require('mongoose');
var Promise = require('bluebird');
var markdown = require('markdown').markdown;
var Message = require('../models/msgboard.js');
var getTime = require('../helpers/time.js');

var ObjectID = mongoose.Types.ObjectId;

var msgboard_get = function (req, res) {
  const NUM_EACH_PAGE = 2;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var query = {};

  Message.find(query).count().exec().then(function (total) {
    return Message.find(query).skip((page - 1) * NUM_EACH_PAGE).limit(NUM_EACH_PAGE)
      .sort({time: -1}).exec().then(function (messages) {
        messages.forEach(function (message) {
          if (message) {
            message.content = markdown.toHTML(message.content);
            message.comments.forEach(function (comment) {
              comment.content = markdown.toHTML(comment.content);
            });
          }
        });
        res.render('msgboard', {
          title: '留言板',
          user: req.session.user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString(),
          messages: messages,
          page: page,
          isFirstPage: (page - 1) === 0,
          isLastPage: ((page - 1) * NUM_EACH_PAGE + messages.length) === total,
          getTime: getTime
        });
      });
  }).catch(function (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  });
};

var msgboard_post = function (req, res) {
  Promise.try(function () {
    var current_user = req.session.user;
    var message = req.body.message && req.body.message.trim();
    if (!message) {
      return Promise.reject('请填写具体的留言内容！');
    }

    var message = new Message({
      user_name: current_user.name,
      content: message,
      time: new Date(),
      count_comments: 0,
      comments: []
    });

    return message.save().return('留言成功！');
  }).then(function (message) {
    req.flash('success', message);
    return res.redirect('/msgboard');
  }, function (err) {
    req.flash('error', err);
    return res.redirect('/msgboard');
  });
};

var del_msg = function (req, res) {
  var msg_id = req.params.msg_id;
  var current_user = req.session.user.name;
  Message.findOneAndRemove({
    _id: ObjectID(msg_id),
    user_name: current_user
  }).exec().then(function (result) {
    if (result) {
      req.flash('success', '删除留言成功！');
      return res.redirect('back');
    } else {
      throw new Error('删除留言失败！您没有删除此留言的权限！');
    }
  }).catch(function (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  });
};

module.exports = {
  msgboard_get: msgboard_get,
  msgboard_post: msgboard_post,
  del_msg: del_msg
};
