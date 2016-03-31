const UPLOAD_FOLDER = './public/upload';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessison = require('express-session');
var MongoStore = require('connect-mongo')(sessison);
var flash = require('connect-flash');
var multer = require('multer');
var helmet = require('helmet');

var routes = require('./routes/index');
var settings = require('./settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(flash());
app.use(multer({
  dest: UPLOAD_FOLDER,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: function (req, file, callback) {
    if (file.mimetype.slice(0, 5) == 'image') callback(null, true);
    else callback(new Error('请选择小于 5M 的图片类型！'), false);
  },
  rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
  }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(sessison({
  secret: settings.cookieSecret,
  key: settings.db,           // cookie name
  cookie: {
    maxAge: 1000 * 60 * 60,   // 1 hour
    httpOnly: true
  },
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  }),
  resave: false,
  saveUninitialized: false
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render('404', {
    title: '404 Not Found……',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
  next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
