/**
 *  断点续传
 */
var express = require("express");
var http = require("http");
/* var multipart = require('connect-multiparty'); */

var App = require("../app.js");
var path = require('path');
var fs = require("fs");
var app=App.app;


var fileStreamsCache = {}


   
 function resume(){
     app.post('/uploadFileStream2',function(req, res){
           getData(req, res)
     })
 }



 async function  getData(req, res){
    var multipart = require('multiparty');
    var form = new multipart.Form()

     //设置编辑
     form.encoding = 'utf-8';
     //设置临时文件存储路径
     form.uploadDir = "temp/"; 

   try{
        let  [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {console.log(err, 'err');res.send(JSON.stringify({code : '02', msg : "error"}));}
             resolve([fields, files]);
        })
     })

     
     files = files['data'][0]; //获取bolb文件
     var index = fields['curIndex'][0]; //当前片数

     var total = fields['total'][0]; //总片数
     var name = fields['name'][0]; //文件名称
    
     var url = 'temp/' + name + index; //临时bolb文件新名字
     fs.renameSync(files.path, url); //修改临时文件名字

     var pathname = 'Uploads/' + name; //上传文件存放位置和名称

     if (index == total) { //当最后一个分片上传成功，进行合并
        // 检查文件是存在，如果存在，重新设置名称
        let NonExist = await new Promise((resolve, reject) => {
            fs.access(pathname, fs.F_OK, (err) => {
                resolve(err);
            });
        })
        if (!NonExist) {
            var myDate = Date.now();
            pathname = 'Uploads/' + myDate + name;
        }
       
        //可写的流
        var writeStream = fs.createWriteStream(pathname);

        var aname = [];

        for (let i = 1; i <= total; i++) {
            let url = 'temp/' + name + i;
            let data = await new Promise(function (resolve, reject) {
                fs.readFile(url, function (error, data) {
                    if (error) reject(error);
                    resolve(data);
                });
            });
            console.log('写入第' + i + "次")
            //把数据写入流里
            writeStream.write(data);
            //删除生成临时bolb文件              
            fs.unlink(url, () => {});
        }
        writeStream.end();
      
        //返回给客户端，上传成功
        var data = JSON.stringify({
            'code': 0,
            'msg': '上传成功'
        });
        res.send(data); //返回数据   

    } else { //还没有上传文件，请继续上传
        var data = JSON.stringify({
            'code': 1,
            'msg': '继续上传'
        });
        res.send(data); //返回数据    
    }}catch(err){
        res.send(err)
    }
  
    
 }

/**
 *   
 *   拼接文件流
 */

 function concatStream(callback){
     var _streams =  Object.keys(fileStreamsCache), _files = new Array(_streams.length), totalStream = ''
     _streams.forEach( function(item, index){
          _files[index] = fileStreamsCache[index]
     })
    
     _files.forEach(function(item, index){
        totalStream = totalStream + item
           
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

 