/**
 *   带进度条的分片上传
 */
let  express = require("express");
let  http = require("http");
/* let  multipart = require('connect-multiparty'); */
require("babel-core/register");
let  App = require("../app.js");
let  path = require('path');
let  fs = require("fs");
let  app = App.app;


function resume(){
    app.all('/upload', function(req,res){
        sliceUpload(req, res)
    })
}

async function sliceUpload(req, res) {
    let fs = require('fs');
    let multiparty = require('multiparty'); 
    let form = new multiparty.Form(); 
    form.encoding = 'utf-8';
    form.uploadDir = "temp/";
    try {
        let [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err)   console.warn('文件上传接收错误')
                resolve([fields, files]);
            })
        })

        files = files['data'][0]; 
        let index = fields['index'][0];
        let total = fields['total'][0];
        let name = fields['name'][0];
     
        let url = 'temp/' + name + index; 
        fs.renameSync(files.path, url); //修改临时文件名字

        let pathname = 'Uploads/' + name; 
        if (index == total) { 
            // 检查文件是存在，如果存在，重新设置名称
            let NonExist = await new Promise((resolve, reject) => {
                fs.access(pathname, fs.F_OK, (err) => {
                    resolve(err);
                });
            })
            if (!NonExist) {
                let myDate = Date.now();
                pathname = 'Uploads/' + myDate + name;
            }
           
            let writeStream = fs.createWriteStream(pathname);
            
            for (let i = 1; i <= total; i++) {
                let url = 'temp/' + name + i;
                let data = await new Promise(function (resolve, reject) {
                    fs.readFile(url, function (error, data) {
                        if (error) reject(error);
                        resolve(data);
                    });
                });
                writeStream.write(data);
                //删除生成临时bolb文件              
                fs.unlink(url, () => {});
            }
            writeStream.end();
    
            let data = JSON.stringify({
                'code': 0,
                'msg': '上传成功'
            });
            res.send(data);    
        } else { 
            let data = JSON.stringify({
                'code': 1,
                'msg': '继续上传'
            });
            res.send(data);   
        }
    } catch (e) {
        res.send(e); 
    }
}

module.exports = {
     resume : resume
}