
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname)));

exports.app=app;
var uploadAction=require("./Action/fileUpload");
//·���¼�����

uploadAction.uploadTest.uploadFile();
//�ļ��ϴ�����

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/users', user.list);

http.createServer(app).listen(4000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});


