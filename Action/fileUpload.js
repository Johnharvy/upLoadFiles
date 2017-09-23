var express = require("express");
var http = require("http");
var multipart = require('connect-multiparty');
var App=require("../app.js");
var path = require('path');
var fs=require("fs");
var app=App.app;

var uploadTest={};

function uploadFile(){
    app.post("/uploadFile", multipart(),function(req,res) {

       var i=0;
       while(i != null){
           if(req.files["file"+i]) upLoad(i);
            else{ i= null; res.json({infor:"success"});return;}
           i++;
       }
        //上传队列文件
       function upLoad(index){
            var filename = req.files["file"+index].originalFilename || path.basename(req.files["file"+index].path);

            //path接口可以指定文件的路径和文件名称，"\结尾默认为路径，字符串结尾默认为文件名"
            var targetPath = path.dirname("") + '/public/uploadFiles/' + filename;

            //fs创建指定路径的文件并将读取到的文件内容写入
            fs.createReadStream(req.files["file"+index].path).pipe(fs.createWriteStream(targetPath));
         }

    });
}

uploadTest.uploadFile=uploadFile;

exports.uploadTest=uploadTest;