/**
 * Created by Maples7 on 2016/3/28.
 */

var markdown = require('markdown').markdown;

module.exports = function (req, res) {
  var user = req.session.user;
  var intro = null;
  if (user) {
    intro = markdown.toHTML(user.intro);
  }
  res.render('index', {
    title: '主页',
    user: user,
    intro: intro,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};
