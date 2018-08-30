/**
 * Module dependencies.
 */

var express = require('express');
require("babel-core/register");
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
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'jade');
// app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
// app.use(router);
app.use(express.static(path.join(__dirname)));
app.set('views', path.join(__dirname, 'views'));

exports.app = app;

var uploadAction=require("./Action/fileUpload");
var resumeAction=require("./Action/slice_to_same");


uploadAction.uploadTest.uploadFile();
resumeAction.resume()


// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});






