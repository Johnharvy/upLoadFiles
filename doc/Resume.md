# 断点续传
> 我们在做视频等大文件上传的需求时，会遇到 :
> 1. 大文件上传时间过长UI反馈不直观的交互性问题;
> 2.  文件上传失败需要重新上传的问题;
> 
> ---
> 为此，我们希望实现断点续传的方式来解决这些问题。这节课的内容是介绍我通过前端知识 + Node.Js实现断点续传的demo的逻辑,同时将我们这个过程遇到的关于前端来操作文件涉及的知识点做个简单的介绍。

## 前端文件的分片

  前端要实现断点的标记，就要做分片，在前端实现记录断开的上传的片的序号，同时在重新上传时从该序号接着上传。这里涉及到一个知识点关于前端的Blob对象,我们从前端获取的File对象继承于Blob对象。

关键代码如下 ：

    let i = item
    let start = i * shardSize, 
        end = Math.min(size, start + shardSize); 

    let form = new FormData();
    form.append("data", file.slice(start, end));
 
 
### * 封装的 jquery.slice.js插件


## 服务器端的分片接收
  服务器端对每片blob数据都会将数据写进一个文件存在指定的中转目录下，并以   中转目录 + 该文件name + 序列号来命名。当前端最后一片文件流上传成功时,再将中转目录下文件分别读取文件流拼接写入新文件，存放到Uploads的目录下，同时删除中转目录下相关的所有文件。

  关键代码如下 ：

        let multiparty = require('multiparty');  //解析表单数据流的插件
        let form = new multiparty.Form(); 
        form.encoding = 'utf-8';
        form.uploadDir = "temp/";
---    

        let [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err)   console.warn('文件上传接收错误')
                resolve([fields, files]);
            })
        })

---    

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


##  文件的其他操作

### 读取文件

不同于Node.js可以直接文件的流数据，前端实现读取文件需要借助H5的新API - FileReader.


### 修改文件

读取原文件的数据进行更改，如拼接截取等，然后重新写入新的File或者Blob实例中去替换原来的File或Blob对象。


## 思考
  在远程加载较大的视频文件或者直播流数据时，如何能通过切片技术和前端的video相关知识实现视频流的分片加载数据来优化视屏的加载交互体验。


















    





 


