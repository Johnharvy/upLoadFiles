/**
 *  断点续传
 */
var express = require("express");
var http = require("http");
var multipart = require('connect-multiparty');
var App=require("../app.js");
var path = require('path');
var fs=require("fs");
var app=App.app;

var fileStreamsCache = {}

 function resume(){
     app.post('/uploadFileStream', multipart(),function(req, res){
          var index = Object.keys(req.body)[0], cont = req.body[index]
          var targetPath = path.dirname("") + '/public/uploadFiles/' + 'big.png';
         fs.createReadStream(req.files["0"].path).pipe(fs.createWriteStream(targetPath));
         
          var _buffer = {
              index : index ,
              cont :  Buffer.from(cont)
          }

        //放进fileStreamsCache收集
          getFileSlice( _buffer )

          //拼接字符串并保存为文件
          concatStream(function(buffer){
             //path接口可以指定文件的路径和文件名称，"\结尾默认为路径，字符串结尾默认为文件名"
            var targetPath = path.dirname("") + '/public/uploadFiles/' + 'big.png';

            //fs创建指定路径的文件并将读取到的文件内容写入
            fs.writeFile(targetPath, buffer, 'base64',function(){
                  res.send({
                      code : '0',
                      msg : 'success!'
                  })
            })
          }) 
     })
 }

/**
 *   
 *   拼接文件流
 */

 function concatStream(callback){
     var _streams =  Object.keys(fileStreamsCache), _files = new Array(_streams.length), totalStream = Buffer.alloc(0,'base64')
     _streams.forEach( function(item, index){
          _files[index] = fileStreamsCache[index]
     })
    
     _files.forEach(function(item, index){
        totalStream = Buffer.concat([totalStream, item])
           
     })  
     callback && callback(totalStream)
 }

 /**
  *  获取文件的流，根据流的标号来有顺序的拼接
  *  @param  {object} filestream
   */

 function getFileSlice(filestream){
      fileStreamsCache[filestream['index']] = filestream.cont
 }


 module.exports = {
     resume : resume
 }

 