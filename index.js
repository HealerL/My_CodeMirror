$(function(){
            
    var textarea = document.getElementById('text');
  
    var myCodeMirror = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true, // 显示行号
        mode: 'javascript',
        spellcheck: true,
        autocorrect: true, 
        theme: 'monokai', // 主题
        foldGutter: true, 
        matchBrackets: true, // 括号匹配
        autoCloseBrackets: true, // 自动补全括号

        extraKeys: {"Ctrl-Space": "autocomplete",
                    'Ctrl-/': 'comment'
        }
    });

    // let start_width = 0;
    // if($(window).innerWidth()<1000){
    //     start_width = $(window).innerWidth() - 50;
    //     myCodeMirror.setSize(start_width + 'px', '300px');
    // }
    // else   myCodeMirror.setSize('1000px', '300px');
    myCodeMirror.setSize('1000px', '300px');

    var result_log = $('.result_content')[0];
    var error_log = $('.error_content')[0];
    let log_list = [result_log, error_log];
    let mirror_list = [];
    log_list.forEach(function(value){
        let log_mirror = CodeMirror(function(newChild){
            value.parentNode.replaceChild(newChild, value);
        }, {
            readOnly: true,
            lineNumbers: true,
            theme: '3024-day'
        });
        log_mirror.setSize('450px', '150px');

        mirror_list.push(log_mirror);
    });

    
    const doc_main = myCodeMirror.getDoc();
    const doc_result = mirror_list[0].getDoc();
    const doc_error = mirror_list[1].getDoc();

    // 保存原始函数副本 劫持console的输出函数
    const funcProxy = {};

    funcProxy['log'] = window.console['log'];
    funcProxy['error'] = window.console['error'];


    // 检测之前的打印区是否有数据
    const output = function(oldvalue, newinput){
        let new_value;
        if(oldvalue){
            new_value =  oldvalue + '\n' + newinput;
        }
        else{
            new_value =  String(newinput);
        }
        doc_result.setValue(new_value);
    }
    funcProxy['protoString'] = Object.prototype.toString;
    
    // 修改toString方法以正确打印对象类型的数据
    Object.prototype.toString = function(){
        // 处理数组和函数类型 打印数组和函数时会优先调用它们自身的tostring方法，这里只是为了正常输出通过object调用的结果
        if(this instanceof Function || this instanceof Array) return funcProxy['protoString'].call(this);
        // 处理map类型
        if(this instanceof Map){
            return Object.prototype.toString.call(map2Obj(this));
        }
        // 处理set类型
        if(this instanceof Set){
            let temp = [...this];
            return Array.prototype.toString.call(temp);
        }
        // 处理对象类型
        let result = '{';
        let key_array = Object.keys(this);
        // 指向调用该方法的上下文对象
        for(let i=0; i<key_array.length; i++){
            result += key_array[i]+ ':' + this[key_array[i]];
            // 除了末尾以外添加逗号
            if(i != key_array.length-1) result += ', ';
        }
        return result +'}';
    }

    function map2Obj(map){
        let obj = {};
        for(let [key, value] of map){
            obj[key] = value;
        }
        return obj;
    }

    // 修改slice方法以正确打印undefined和null
    Array.prototype.slice = function(start=0, end=this.length){
        const res = new Array();
        if(start < 0) start += this.length;
        if(end < 0) end += this.length;
        
        for(let i=start; i<end; i++){
            if(typeof this[i] === undefined){
                res.push('undefined');
            }
            else if(this[i] === null){
                res.push('null');
            }
            else{
                res.push(this[i]);
            }
        }
        return res;
    }

    window.console['log'] = function(){
        let previous = doc_result.getValue();
        let new_value;

        // 处理一个consolelog中多个数据的情况
        
        let data = Array.prototype.slice.call(arguments);
        let data_str = data.join(' ');

        output(previous, data_str);
        funcProxy['log'].apply(this, arguments);
    }

    
    window.console['error'] = function(){
        doc_error.setValue(String(arguments[0]));
        funcProxy['error'].apply(this, arguments);
    }

    const $submit = $('#submit');
    const $clear =  $('#clear');


    $submit.mousedown(function(){
        $(this).css('border', '3px solid black');
    });
    $submit.mouseup(function(){
        $(this).css('border', '3px solid transparent');
    })


    $clear.mousedown(function(){
        $(this).css('border', '3px solid black');
    });
    $clear.mouseup(function(){
        $(this).css('border', '3px solid transparent');
    })

    
    $submit.click(function(){
        // 清空结果区
        doc_result.setValue('');
        doc_error.setValue('');
        new Promise(function (resolve, reject) {
            eval(doc_main.getValue());
        }).catch(function(error) {
            console.error(error);
        })
    });

    $clear.click(function(){
        // 清除内容和结果区
        doc_main.setValue('');
        doc_result.setValue('');
        doc_error.setValue('');

        // 利用定时器的匿名ID特性，一次性清除所有的定时器
        for(let i = 0; i < 9999; i++) {
            clearInterval(i);
        }
    })

    // $(window).resize(function(){
    //     if($(this).innerWidth() < 1000){
    //         let width = $(this).innerWidth();
    //         if (width < 400) width = 400;
    //         myCodeMirror.setSize(width+'px', '300px');
    //     }
    // });
})