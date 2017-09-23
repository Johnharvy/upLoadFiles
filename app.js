/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var flash=require("connect-flash");
var multer = require("multer");
var cookieParser = require('cookie-parser')
var session = require("express-session");
// var favicon = require("static-favicon");
var logger = require("morgan");
var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var errorhandler = require("errorhandler");
// var router = require("router");

// all environments
app.set('port', process.env.PORT || 4000);
app.set('view engine', 'jade');
// app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
// app.use(router);
app.use(express.static(path.join(__dirname)));
app.set('views', path.join(__dirname, 'views'));

exports.app=app;

var uploadAction=require("./Action/fileUpload");
//·���¼�����
console.log(uploadAction);
uploadAction.uploadTest.uploadFile();
//�ļ��ϴ�����

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}


app.get('/users', user.list);

http.createServer(app).listen(4000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});






