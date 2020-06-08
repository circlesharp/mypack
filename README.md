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
> 1. 将 require 变成 __webpack_require__
> 2. 改写依赖的路径，变成 ./src...
> 3. 得到依赖数组 dependencies
