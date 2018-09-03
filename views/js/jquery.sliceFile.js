
/**
 *    分片上传文件的插件,默认ajax post请求
 *    @parmas {object} options
 *    file          指定的文件,必选
 *    apiUrl        接口地址，必选
 *    sliceSize     切片的文件流单位大小, 默认 120 * 1024B
 *    resumeDom     断点续传监听阻断上传的dom,默认点击事件为停止上传,该值默认为null
 *    sucess        每片文件成功回掉
 *    fail          失败回调
 *    supplyData    每次请求除了文件提供的额外数据,默认为{}
 *    headers       header部分内容指定,默认为null
 *    timeout       超时时间,默认 120 * 1000ms
 *    finish        所有文件上传完成
 *    
 */
(function($){
   $.sliceFiles = function(options){
        if(!options) options = {}
        options = Object.assign({ 
            sliceSize : 1024,
            resumeDom : null,
            file : null,
            timeout : 120 * 1000, //毫秒
            supplyData : {},
        },options) 

        let curIndex = 0, allowUpload = true, shardSize = options.sliceSize
        let  file = options.file, //上传文件主体
                name = file.name, //文件名
                size = file.size, //总大小
                succeed = 0, //当前片数
                shardCount = Math.ceil(size / shardSize); //总片数

        //有指定阻断上传的dom
        if(options.resumeDom){
            async  function selectIndex(index){
                let _index = index? index : 0, _asyncs = []
                for (let item = _index; item < shardCount; ++item) {
                        await fn(item); 
                }
             }

            $(options.resumeDom).on('click', function(){
                allowUpload = !allowUpload
                selectIndex(curIndex)
            })
            selectIndex(0)
        }else{
            function selectIndex(index){
                let _index = index? index : 0
                for (let item = _index; item < shardCount; ++item) {
                         fn(item); 
                }
             } 
             selectIndex(0)
        }
        
        /**
             *   上传
             *   item为当前片段序号
         */
        function fn(item) {
            return new Promise((resolve, reject) => {
               if(!allowUpload) {  curIndex = item; return false; }  //阻断响应，上传失效
                let i = item
                let start = i * shardSize, 
                    end = Math.min(size, start + shardSize); 

                let form = new FormData();
                form.append("data", file.slice(start, end));
                form.append("name", name); //文件名字
                form.append("total", shardCount); //总片数
                form.append("index", i + 1); //当前片数
                form.append('supplyData', Object.assign( options.supplyData, {}))

                //Ajax提交
                $.ajax({
                    url: options.apiUrl,
                    type: "POST",
                    headers : options.headers || null,
                    data: form,
                    timeout:  options.timeout,
                    async: false,  //同步
                    processData: false, 
                    contentType: false, 
                    success: function (data) {
                        succeed++
                        let progress = Math.round(succeed / shardCount * 100)
                        if(succeed / shardCount > 1) return;
                        options.success && options.success(data, progress)
                        if(progress === 100) {
                          
                            if(options.resumeDom){
                                $(options.resumeDom).off('click')
                            }
                            options.finish && options.finish();
                            }
                        if(options.resumeDom)    setTimeout(resolve, 0);  
                        else resolve()
                    },
                    fail : function(err){
                        options.fail && options.fail(err)
                        reject()
                    }
                });
            })
        }
   }
})(jQuery)