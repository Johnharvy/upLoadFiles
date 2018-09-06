
# Jquery.slice.js

> 该插件依赖jquery的库实现文件分片上传，同时提供实现断点续传的功能需求。

## 调用方式
    
$.sliceFiles([options])

###  options
 
类型 :  PlainObject

一个以"{键:值}"组成的请求设置

----
#### file 

类型: Blob， 必选项。

你要上传的文件目标。

---

#### apiUrl

类型: String， 必选项。

上传文件的目标接口地址。

---

#### sliceSize 

类型: Number， 可选项。

切片的文件流单位大小, 默认 1 * 1024B

---

#### resumeDom 

类型: HtmlDomObject， 可选项。

断点续传监听阻断上传的dom,默认点击事件为停止上传,该值默认为null

---

#### sucess  

类型: Function， 可选项。

每片文件流上传成功时的回调函数

---

#### fail   

类型: Function， 可选项。

每片文件流上传失败时的回调函数

---

#### supplyData

类型: JSON， 可选项。

每次请求额外需要上传的JSON格式的键值对数据。

---

#### headers 

类型: plainObject， 可选项。

每次请求需要身份验证的情境下,可能会需要在header中设置数据。

---

#### timeout  

类型: Number， 可选项。

请求超时时间,默认 120 * 1000ms

---

#### finish  

类型: Function， 可选项。

所有文件上传成功时执行的回调函数。











