# FileReader
> * FileReader主要用于将文件内容读入内存，通过一系列异步接口，可以在主线程中访问本地文件。
> * 使用FileReader对象，web应用程序可以异步的读取存储在用户计算机上的文件(或者原始数据缓冲)内容，可以使用File对象或者Blob对象来指定所要处理的文件或数据。

## 创建实例

    var reader = new FileReader();


## 方法

| 方法定义   |      Are      | 
|----------|:-------------:|
| abort():void | 终止文件读取操作 | 
| readAsArrayBuffer(file):void |   异步按字节读取文件内容，结果用ArrayBuffer对象表示  |   
| readAsBinaryString(file):void |异步按字节读取文件内容，结果为文件的二进制串 | 
| readAsDataURL(file):void	 |  异步读取文件内容，结果用data:url的字符串形式表示 |
| readAsText(file,encoding):void	|异步按字符读取文件内容，结果用字符串形式表示 |

## 事件

| 事件名称  |     描述     | 
|----------|:-------------:|
| onabort | 当读取操作被中止时调用 | 
| onerror |   当读取操作发生错误时调用  |   
| onload | 当读取操作成功完成时调用 | 
| onloadend	 |  当读取操作完成时调用,不管是成功还是失败 |
| onloadstart	|	当读取操作将要开始之前调用 |
| onprogress	| 在读取数据过程中周期性调用 |

### 例子 
FileReader通过异步的方式读取文件内容，结果均是通过事件回调获取，下面是一个读取blob对象内容的例子：

    var input  = document.getElementById("file"); //input file
    input.onchange = function(){
        var file = this.files[0];
        if(!!file){
            //读取本地文件，以gbk编码方式输出
            var reader = new FileReader();
            reader.readAsText(file,"gbk");
            reader.onload = function(){
                //读取完毕后输出结果
                console.log(this.result);
            }
        }
    }

此外我们还可以通过注册onprogress、onerror等事件，记录文件读取进度或异常行为等等。

##  应用场景
 * 在线预览本地文件

        var input  = document.getElementById("file");   // input file
        input.onchange = function(){
            var file = this.files[0];
                if(!!file){
                    var reader = new FileReader();
                    // 图片文件转换为base64
                    reader.readAsDataURL(file);
                    reader.onload = function(){
                        // 显示图片
                        document.getElementById("file_img").src = this.result;
                }
            }
        }
 *  二进制数据上传
     
        var input  = document.getElementById("file");   // input file
        input.onchange = function(){
            var file = this.files[0];
                if(!!file){
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function(){
                        var binary = this.result;
                        upload(binary);
                }
            }
        }

        //文件上传
            function upload(binary){
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://xxxx/opload");
                xhr.overrideMimeType("application/octet-stream");
                //直接发送二进制数据
                if(xhr.sendAsBinary){
                    xhr.sendAsBinary(binary);
                }else{
                    xhr.send(binary);
                }
                
                // 监听变化
                xhr.onreadystatechange = function(e){
                    if(xhr.readyState===4){
                        if(xhr.status===200){
                            // 响应成功       
                        }
                    }
                }
            }
 




