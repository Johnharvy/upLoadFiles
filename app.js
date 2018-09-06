/**
 * Module dependencies.
 */

var express = require('express');
require("babel-core/register");
var http = require('http');
var path = require('path');
var opn = require('opn')
var ip = require('ip')

var app = express();
var errorhandler = require("errorhandler");
app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname)));
exports.app = app;

var uploadAction=require("./Action/fileUpload");
var resumeAction=require("./Action/slice_to_same");
uploadAction.uploadTest.uploadFile();
resumeAction.resume()


http.createServer(app).listen(app.get('port'), function(){
        opn('http://' + ip.address() + ':' + app.get('port') + '/views/sliceUpload.html')
});






