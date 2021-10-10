# Codemirror学习

官方网站：https://codemirror.net/index.html



## 基础使用

基础使用，需要在你的html文件中导入下列文件

```html
<script src="lib/codemirror.js"></script>
<link rel="stylesheet" href="lib/codemirror.css">
<script src="mode/javascript/javascript.js"></script>
```



然后在html中使用CodeMirror类来生成一个实例对象：

```javascript
var myCodeMirror = CodeMirror(document.body);
```

![image-20211006163116436](https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20211006163116436.png)

它会添加一系列DOM元素



还可以将指定元素替换成编辑器：

```javascript
var myCodeMirror = CodeMirror(function(elt) {
  myTextArea.parentNode.replaceChild(elt, myTextArea);
}, {value: myTextArea.value});
```

并且将文本框myTextArea中的内容作为编辑器中的内容进行显示。



更方便的写法：

```javascript
var myCodeMirror = CodeMirror.fromTextArea(myTextArea);
```



### 初始化参数



通过对象来给实例对象传递参数，常用的设置：

- value:初始内容

- Mode:设置编译器编程语言关联内容，对应的mine值

- Theme:编译器的主题，需要引入对应的包

- tabSize：tab的空格宽度

- lineNumbers：是否使用行号

- smartIndent：自动缩进是否开启

- indentUnit：缩进单位

- keyMap：快捷键，default使用默认快捷键，除此之外包括emacs，sublime，vim快捷键，使用需引入工具

- spellcheck: 是否检查拼写 boolean值

- autocorrect': 是否自动纠正 

- matchBrackets: true, // 括号匹配  

- autoCloseBrackets: true, // 自动补全括号

  ```javascript
  // 括号匹配和括号补全
  <script src="addon/edit/matchbrackets.js"></script>
  <script src="addon/edit/closebrackets.js"></script>
  ```

  

```javascript
{
	mode:'javascript'  // 编辑器语言
	theme:'monokai',  // 编辑器主题
	lineNumbers: true,  // 显示行号
    value: ''  // 初始内容
}
```



### 样式

默认的编辑器生成出来是如下的样式：

![image-20211006172527679](https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20211006172527679.png)

使用自带的主题，需要引入theme文件下的文件

```javascript
<link rel="stylesheet" href="theme/monokai.css">
```

然后在初始化设置为该主题。



还可以在`codemirror.css`中添加上自己喜欢的样式。

设置宽度高度，边框字体等。

```css
.CodeMirror {
  /* Set height, width, borders, and global font properties here */
  font-family: Consolas;
  height:500px;
  width: 400px;
  color: black;
  direction: ltr;
  border-radius: 5px;
}
```



设置代码区域宽和高

```javascript
myCodeMirror.setSize('1000px', '300px');
```





#### 添加搜索框

demo：https://codemirror.net/demo/search.html

方法：

添加下列文件

```html
// 核心
<script src="addon/search/search.js"></script>
<script src="addon/search/searchcursor.js"></script>
// 可以跳转到指定行，列
<script src="addon/search/jump-to-line.js"></script>
// 搜索框的样式
<script src="addon/dialog/dialog.css"></script>
<script src="addon/dialog/dialog.js"></script>
```

然后按下Ctrl-F会在DOM中自动添加一个负责搜索的元素，

位置不是很好，就对该元素所在的类添加一个样式：

```css
.CodeMirror-dialog {
     position: absolute;
     top: 0; 
     right: 0;
     /* background: inherit; */
     z-index: 15;
     padding: .1em .8em;
     overflow: hidden;
     color: inherit;
     background-color: rgb(121, 193, 241);
}
```



<img src="https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20211007110050680.png" alt="image-20211007110050680" style="zoom: 50%;" />



定位到右上角进行显示。



#### 代码补全

demo：https://codemirror.net/demo/complete.html

方法：

添加下列文件：

```html
<script src="addon/hint/javascript-hint.js"></script>
<script src="addon/hint/show-hint.js"></script>
<link rel="stylesheet" href="addon/hint/show-hint.css">
```

初始设置添加：

```javascript
extraKeys: {"Ctrl-Space": "autocomplete"}
```

通过Ctrl-Space来激活提示功能

如果当前字符补全只有一种可能，就会自动补全，不会显示提示框。

如果有多种可能，就会显示提示框。

如果没有可能，就什么也不显示。



注意：这个键的组合有可能会与输入法切换冲突，从而切换输入法，而不会进行补全。

但又要方便一个手按的组合，好像也没剩啥了，就这样吧。



这个默认的补全只会针对原本词库里的词，不会对新定义的变量或者函数进行补全。

经过查找，发现提示词是来自于`javascript-hint.js`中设置的

```javascript
// js提示关键词
  var javascriptKeywords = ("break case catch class const continue debugger default 								delete do else export extends false finally for function " +
                  			"if in import instanceof new null return super switch this 									throw true try typeof var void while with yield yes").split(" ");
```

对这个进行的修改会反应到提示词部分：

<img src="https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20211007144926002.png" alt="image-20211007144926002" style="zoom: 67%;" />



注释掉`show-hint.js`文件中的下面这个if部分，就可以使得选项只有1个的时候不会自动补全

```javascript
if (data && data.list.length) {
    // if (picked && data.list.length == 1) {
    //   this.pick(data, 0);
    // } else {
      this.widget = new Widget(this, data);
      CodeMirror.signal(data, "shown");
    // }
  }
}
```



从生成的语句来说，对于定义的变量或者函数会被自动识别，并且添加类`cm-def`





#### 注释快捷键

发现默认的清空下，没有注释快捷键，于是自己添加一个。

首先在生成配置时，添加快捷键，并起名为comment。

```javascript
extraKeys: {
			'Ctrl-/': 'comment'
           }
```



然后在`codemirror.js`中找到快捷键设置的地方6698行

keyMap.pcDefault对象中添加这个快捷键

```javascript
  keyMap.pcDefault = {
    // ...
    'Ctrl-/':'comment',
  };
```



然后在下方的6975行commands对象中添加以comment作函数名的方法，表示触发该快捷键就会调用这个方法：

```javascript
comment: function (cm) {
      cm.toggleComment();      
    },
```

这里发现自带扩展comment.js里已经有这么一个函数`toggleComment()`满足注释需要了

该函数作用：可以将选中区域进行注释；如果已经注释就取消注释。符合使用习惯。



看一下这个函数的写法：

```javascript
  CodeMirror.defineExtension("toggleComment", function(options) {
    if (!options) options = noOptions;
    var cm = this;
    var minLine = Infinity, ranges = this.listSelections(), mode = null;
    for (var i = ranges.length - 1; i >= 0; i--) {
      // 这里的from和to会根据行编号来从小到大
      var from = ranges[i].from(), to = ranges[i].to();
      if (from.line >= minLine) continue;
      if (to.line >= minLine) to = Pos(minLine, 0);
      minLine = from.line;
      // 以第一个区域的情况为准
      if (mode == null) {
       	// 取消注释成功，就将标记设为无注释状态
        if (cm.uncomment(from, to, options)) mode = "un";
        // 取消注释失败表示当前没有注释，所以添加注释
        else { cm.lineComment(from, to, options); mode = "line"; }
      } else if (mode == "un") {
        cm.uncomment(from, to, options);
      } else {
        cm.lineComment(from, to, options);
      }
    }
  });
```

- cm.uncomment(from: {line, ch}, to: {line, ch}, ?options: object) → boolean

  取消注释，如果取消成功就返回true

- cm.lineComment(from: {line, ch}, to: {line, ch}, ?options: object) ：

  接收一个封装的行对象，将其注释，无返回值



文档解释的不是很清楚，打印了一下这个`cm.listSelections()`返回的对象：

<img src="https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20211008221458938.png" alt="image-20211008221458938" style="zoom: 80%;" />

可以看出是由起始位置对象和终止位置对象构成的

Pos对象表示位置信息，line属性指代行编号，ch指代光标前的字符数量，

anchor和head的大小顺序由选择的方向决定，

从上向下选时，anchor是首行，从下向上，anchor是末尾行。所以看出anchor指的是选择的起点，head是终点。

```javascript
// 这里的from和to会根据行编号来从小到大
var from = ranges[i].from(), to = ranges[i].to();
```

上面这两个方法会进行排序，选择编号小的行对象作为from，大的作为to；保证操作是从上到下，不随鼠标选择方向而变化。



```javascript
// 取消注释成功，就将标记设为无注释状态
if (cm.uncomment(from, to, options)) mode = "un";
// 取消注释失败表示当前没有注释，所以添加注释
else { cm.lineComment(from, to, options); mode = "line"; }
```

先尝试对第一个区域中代码段进行取消注释，如果取消成功就更改mode状态告诉后续区域进行取消注释，如果取消失败，就添加注释，并更改mode状态。

只要该区域中有一行取消注释成功，都会返回true。也算知道了注释操作的逻辑。





```javascript
if (mode == null){
	...
 }
 else if (mode == "un") {
    cm.uncomment(from, to, options);
  } else {
    cm.lineComment(from, to, options);
  }
```

这个if-else 块的作用是多个区域选中时要进行注释还是取消注释，是统一决定的，因为mode的修改只存在于第一次循环，后续会根据第一次的结果来决定操作的种类。即后续区域根据第一个区域的状态决定。

目前没有用到多区域选择这个东西。



## 原理分析





CodeMirror函数定义在7876行

```javascript
function CodeMirror(place, options) {
    var this$1 = this;
    // 强制当作构造函数使用，获取实例
    if (!(this instanceof CodeMirror)) { return new CodeMirror(place, options) }
    // ...
}
```

接收两个参数，一个参数place就是待转化的DOM对象，一个是设置对象，也就是初始化传入的默认设置。



定义options属性为传入对象options，如果没有传入，就使用一个空对象进行赋值，确保this.options和options都指代对象。

```javascript
this.options = options = options ? copyObj(options) : {};
```



获取需要作为初始化显示的代码，存储在options对象的value属性中

```javascript
var doc = options.value;
if (typeof doc == "string") { doc = new Doc(doc, options.mode, null, 													options.lineSeparator, options.direction); }
else if (options.mode) { doc.modeOption = options.mode; }
this.doc = doc;
```



Doc对象定义在6103行



copyObj函数将obj对象的属性进行浅复制给target对象。

```javascript
function copyObj(obj, target, overwrite) {
    if (!target) { target = {}; }
    for (var prop in obj)
      { if (obj.hasOwnProperty(prop) && (overwrite !== false || 					 											 !target.hasOwnProperty(prop)))
        { target[prop] = obj[prop]; } }
    return target
}
```





还有官方定义的从textarea元素构建的方法：





每次换行都会在DOM中添加一个下面的元素，内容会进行实时更新

```html
<pre class=" CodeMirror-line " role="presentation">
	<span role="presentation" style="padding-right: 0.1px;">
		<span class="cm-variable">ddddd</span>
	</span>
</pre>
```



输入显示右侧的竖杠闪动效果

<img src="https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20211006165956065.png" alt="image-20211006165956065" style="zoom: 33%;" />

通过一个元素的消失与出现来实现：

<img src="https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20211006170258484.png" alt="image-20211006170258484" style="zoom: 50%;" />



通过符号或者括号将一行的文本进行分割成小的span结构，每个单词或者数字都各自处于一个span中





### 文本高亮

#### 关键字高亮部分

通过列举关键字，并将它们分类，然后根据类别设置不同的颜色：

```javascript
  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c"), D = kw("keyword d");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    return {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": D, "break": D, "continue": D, "new": kw("new"), "delete": C, "void": C, "throw": C,
      "debugger": kw("debugger"), "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
      "await": C
    };
  }();
```



操作符部分通过正则表达式进行匹配：

```javascript
 var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
```



## 个人使用

还有的问题：

1.快捷键添加注释

2.代码输出结果有点太浪费资源，没有合理利用原本结构

3.错误信息字体颜色修改

4.定义过的参数只有定义时会样式化，后续使用样式消失

5.没有代理console信息



console代理：

