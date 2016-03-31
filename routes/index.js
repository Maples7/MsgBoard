var express = require('express');
var index = require('../controllers/index.js');
var register = require('../controllers/register.js');
var user = require('../controllers/user.js');
var login = require('../controllers/login.js');
var msgboard = require('../controllers/msgboard.js');
var comment = require('../controllers/comment.js');
var checkLog = require('../middlewares/checkLog.js');

var router = express.Router();

// index router
router.get('/', index);

// register router
router.get('/reg', checkLog.checkNotLogin, register.reg_get);
router.post('/reg', checkLog.checkNotLogin, register.reg_post);

// user router
router.get('/u/:name', user.user_get);
router.get('/edit', checkLog.checkLogin, user.edit_get);
router.post('/edit', checkLog.checkLogin, user.edit_post);

// login & logout router
router.get('/login', checkLog.checkNotLogin, login.login_get);
router.post('/login', checkLog.checkNotLogin, login.login_post);
router.get('/logout', checkLog.checkLogin, login.logout_get);

// MsgBoard router
router.get('/msgboard', checkLog.checkLogin, msgboard.msgboard_get);
router.post('/msgboard', checkLog.checkLogin, msgboard.msgboard_post);

router.post('/comment', checkLog.checkLogin, comment.comment_post);
router.get('/delMsg/:msg_id', checkLog.checkLogin, msgboard.del_msg);
router.get('/delCom/:msg_id/:com_id/:del_type', checkLog.checkLogin, comment.del_com);

module.exports = router;
