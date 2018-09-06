# Blob

###  什么是Blob对象
 > 一直以来，JS都没有比较好的可以直接处理二进制的方法。而Blob的存在，允许我们可以通过JS直接操作二进制数据。Blob对象可以看做是存放二进制数据的容器，此外还可以通过Blob设置二进制数据的MIME类型。

## 创建
    
    var blob = new Blob(dataArr:Array<any>, opt:{type:string});

 * ### 通过构造函数

 ####  创建一个装填DOMString对象的Blob对象

	    var s =  ["<div>123</div>"]
	    var blob = new Blob(s, {type : "text/html"})
	    console.log(blob)

 #### 创建一个装填ArrayBuffer对象的Blob对象

	    var b = [new ArrayBuffer(8)]. //8位整数值的类型化数组,内容将初始化为 0
	    var Bb = new Blob(b, {type : "text/plain"})
	    console.log(Bb, 'Bb')
	    
	    var f = new FileReader()
	        f.readAsArrayBuffer(Bb)
	        f.onload = function(){
	         console.log(this.result, 'ArrayBuffer(8)')
       }    
	    
* ### 通过Blob.slice()
此方法返回一个新的Blob对象，包含了原Blob对象中指定范围内的数据

    Blob.slice(start:number, end:number, contentType:string)

例如 ：

    var a = new Blob([0,1,2,3,4,5,6,7,8,9],{type : "text/plain"})
    var b = a.slice(0,5)
    console.log(b)

* ### 通过canvas.toBlob()

        var canvas = document.getElementById("canvas");
        canvas.toBlob(function(blob){
            console.log(blob);
        });

* ### 应用场景
* #### 分片上传文件
       
* #### 构建下载文件
        createDownload("download.txt","download file");

        function createDownload(fileName, content){
            var blob = new Blob([content]); //塞入内容到blob对象中
            var link = document.createElement("a");
            link.innerHTML = fileName; //指定下载的链接的文本
            link.download = fileName;  //指定下载的文件的名称
            link.href = URL.createObjectURL(blob);
            document.getElementsByTagName("body")[0].appendChild(link);
        }





 


