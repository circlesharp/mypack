# mypack

## description
1. 手写 webpack 的 source
2. 练习项目在另一个 repo: https://github.com/circlesharp/learning-webpack

## P33 webpack手写
1. 在 package.json 添加 bin 字段, 并且 `touch ./bin/mypack`
2. `npm link` 将包链接到全局上，可以在全局执行命令

## P34 webpack分析及处理
1. 对于 /bin/mypack.js, 引入 config, Compiler，`(new Compiler(config)).run()`
2. 值得注意的是，config 引入时不要用 __dirname

## P35 创建依赖关系
1. 对于 /lib/Compiler.js, 构建时的主要实例属性有：`config, entry, entryId, root, modules`
2. run: 构建模块 -> buildModule, 弹出文件 -> emitFile
3. buildModule: 确定 entryId, modules

## P36 AST递归解析
1. babylon -> 将源码转换成 ast
> ast: https://astexplorer.net/
2. @babel/traverse -> 遍历节点
> callExpression: 调用表达式，如 `a(), require()`
3. @babel/types -> 替换
> 有一个 `stringLiteral` 方法，提取 arguments, 让树对象变成字符串，放入数组
4. @babel/generator -> 生成
> `generator(ast).code`, 生成数组，code 字段就是代码
5. parse 函数的作用: 
> 1. 将 require 变成 `__webpack_require__`
> 2. 改写依赖的路径，变成 ./src...
> 3. 得到依赖数组 dependencies
6. buildModule 递归，最终效果可以在 `this.modules` 看到

## P37 生成打包结果
1. 关于 ejs 的学习
> 参考：https://www.bilibili.com/video/BV1eJ411M7s6?t=7117  
> render 的第二个参数是对象，用于传参  
2. 制作模板 main.ejs, 要注意空格，否则路径不对，就会报错
3. `emitFile` 重点是路径的处理，这里还没有处理多入口的问题

## P38 增加loader
1. getSource 的编写，要遍历 `this.config.module.rules`, 递归实现
2. loader 的编写(在 rewriteWebpack)，导出 loader 函数，接受 source 源代码
3. stylus-loader 主要是使用 `stylue.render` 方法
4. stylus-loader 的 `css = css.replace(/\n/g, '\\n')` 暂时不知道为啥要这样用
5. style-loader 的作用在于将创建 style 节点，注意 `JSON.stringify` 的使用，将多行转为单行

## P39 增加plugin
1. 在实例化 compiler 的时候，增加实例属性 `this.hooks`，里面的字段都是 tapable 的钩子的实例化
2. plugin 的编写在于提供一个 `apply` 方法，接受 compiler 作为入参，并订阅事件
3. 有订阅就有发布，发布多数在 Compiler.js 中进行的，也可以在 bin/mypack.js 中发布
