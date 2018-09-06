# FormData
>FormData 对象的使用：
>1.用一些键值对来模拟一系列表单控件：即把form中所有表单元素的name与value组装成
一个queryString
>2. 异步上传二进制文件。

## 使用注意点

* jquery

        $.ajax({
        url: 'file.php',
        type: 'POST',
        data: formdata,                    // 上传formdata封装的数据
        dataType: 'JSON',
        cache: false,                      // 不缓存
        processData: false,                // jQuery不要去处理发送的数据
        contentType: false,                // jQuery不要去设置Content-Type请求头
        success:function (data) {           //成功回调
            console.log(data);
        }
    });


* new FormData的参数是一个DOM对象，而非jQuery对象

        var formData = new FormData($("#file")[0]);

