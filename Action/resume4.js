/**
 *  断点续传
 */

var express = require("express");
var http = require("http");
var multipart = require('connect-multiparty');

require("babel-core/register");

var App = require("../app.js");
var path = require('path');
var fs = require("fs");
var app=App.app;

function upload(){
    app.all('/uploadAgain', function(req,res){
        sliceUpload(req, res)
    })
}

async function sliceUpload(req, res) {
    var fs = require('fs');
    var multiparty = require('multiparty'); //文件上传模块
    var form = new multiparty.Form(); //新建表单

    form.encoding = 'utf-8';
    form.uploadDir = "temp/"; // "Uploads/";

    // form.maxFilesSize = 200 * 1024 * 1024;
    /*form.parse表单解析函数，fields是生成数组用获传过参数，files是bolb文件名称和路径*/
    
    try {
        let [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject('test err');
                console.log(fields, 'fields')
                resolve([fields, files]);
            })
        })

        files = files['data'][0]; //获取bolb文件
        var index = fields['index'][0]; //当前片数
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
                //把数据写入流里
                writeStream.write(data);
                //删除生成临时bolb文件              
                fs.unlink(url, () => {});
            }
            writeStream.end();
          
            //返回给客服端，上传成功
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
        }
    } catch (e) {
      /*   logs.info(e); */
        res.send(e); //返回数据    
    }
}

module.exports = {
     upload : upload
}
