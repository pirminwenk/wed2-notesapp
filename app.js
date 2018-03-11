let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let hbs = require('hbs');
const moment = require('moment');

let index = require('./routes/index');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// TODO uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/detail', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

hbs.registerHelper('times', function(count, block) {
  return block.fn().repeat(count);
});

hbs.registerHelper('checked', function (currentValue) {
  return currentValue === true ? 'checked' : '';
});

hbs.registerHelper('negate', function (currentValue) {
  return !currentValue;
});

hbs.registerHelper('orderBySortASC', function (orderBy) {
  return this.orderBy === orderBy && this.sortASC ? 'false' : 'true';
});

hbs.registerHelper('sortClass', function (orderBy) {
  let sortOrder = this.sortASC ? 'asc' : 'desc';
  return this.orderBy === orderBy ? sortOrder : '';
});

hbs.registerHelper('relativeTime', function (time) {
  return moment(time, 'YYYY-MM-DD').fromNow();
});

module.exports = app;
