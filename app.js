var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mime = require('mime');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// ヘッダー設定
// app.use(function(req, res, next){
//   next();
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// express.static.mime.define({'text/css': ['css']});

app.use(express.static(path.join(__dirname, '/public'), {
  setHeaders: function(res, sentPath, stat){
    console.log('GET:' + sentPath + ', MIME:' + mime.getType(path.extname(sentPath)));
    // res.set('content-type', mime.getType(path.extname(sentPath)));
    res.set('content-type', 'text/plain');
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;

// console.log(`${crypto.getHashes()}`);
