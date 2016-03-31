/**
 * Created by Maples7 on 2016/3/28.
 */

var mongoose = require('mongoose');
var Message = require('../models/msgboard.js');

var ObjectID = mongoose.Types.ObjectId;

var comment_post = function (req, res) {
  var current_user = req.session.user.name;
  var content = req.body.content && req.body.content.trim();
  if (!content) {
    req.flash('error', '请填写具体的评论内容！');
    return res.redirect('back');
  }
  var comment = {
    id: req.body.comment_id,
    user_name: current_user,
    time: new Date(),
    content: content
  };
  Message.findByIdAndUpdate(req.body.father_id, {
    $push: {comments: comment},
    $inc: {count_comments: 1}
  }).exec().then(function () {
    req.flash('success', '评论成功！');
    return res.redirect('back');
  }).catch(function (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  })
};

var del_com = function (req, res) {
  var params = req.params;
  var msg_id = params.msg_id;
  var comment_id = params.com_id;
  var del_type = parseInt(params.del_type);
  var current_user = req.session.user.name;
  var query_string = {"_id": ObjectID(msg_id)};
  var pull_query = {id: comment_id};

  switch (del_type) {
    case 1:
      pull_query.user_name = current_user;
      break;
    case 2:
      query_string.user_name = current_user;
      break;
    default:
      req.flash('error', '您没有删除此条评论的权限！');
      return res.redirect('back');
  }

  Message.findOneAndUpdate(query_string, {
    $pull: {comments: pull_query}
  }, {upsert: false}).exec().then(function (result) {
    if (result) {
      req.flash('success', '删除评论成功！');
      return res.redirect('back');
    } else {
      throw new Error('删除评论失败！您没有删除此评论的权限！');
    }
  }).catch(function (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  });
};

module.exports = {
  comment_post: comment_post,
  del_com: del_com
};
