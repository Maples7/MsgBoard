/**
 * Created by Maples7 on 2016/3/28.
 */

var checkLogin = function (req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录！');
    return res.redirect('/login');
  } else {
    next();
  }
};

var checkNotLogin = function (req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录！');
    return res.redirect('back');
  } else {
    next();
  }
};

module.exports = {
  checkLogin: checkLogin,
  checkNotLogin: checkNotLogin
};
