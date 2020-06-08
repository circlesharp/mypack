const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

class Compiler {
  constructor (config) {
    this.config = config
    this.entryId = ''
    this.modules = {}
    this.entry = config.entry
    this.root = process.cwd()
  }
  run () {
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.emitFile()
    // this.__showDetail()
  }
  buildModule (modulePath, isEntry) { // 执行并且创建模块的依赖关系
    const source = this.getSource(modulePath) // 拿到模块内容
    const moduleName = './' + path.relative(this.root, modulePath) // 拿到模块id
    const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)) // 改造源码，返回依赖列表
    // console.log(sourceCode, dependencies)
    if (isEntry) { this.entryId = moduleName }
    this.modules[moduleName] = sourceCode
  }
  /**
   * AST 解析语法树
   * parse 的主要作用是:
   * 1. 将 require 变成 __webpack_require__
   * 2. 改写依赖的路径，变成 ./src...
   * 3. 得到依赖数组 dependencies
   */
  parse (source, parentPath) {
    const ast = babylon.parse(source)
    const dependencies = [] // 依赖数组
    traverse(ast, {
      CallExpression (p) {
        const node = p.node // 对应的节点(也叫 ExpressonStatement)
        let modeluName
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          modeluName = node.arguments[0].value // 注意索引，因为不止一个参数
          modeluName = modeluName + (path.extname(modeluName) ? '' : '.js')
          modeluName = './' + path.join(parentPath, modeluName)
          dependencies.push(modeluName)
          node.arguments = [t.stringLiteral(modeluName)] // 提取 arguments, 让树对象变成字符串，放入数组
        }
      }
    })
    const sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }
  emitFile () { // 发射一个文件（打包后的文件）
    //
  }
  getSource (path) {
    let content = fs.readFileSync(path, 'utf8')
    return content
  }
  __showDetail () {
    console.log('config', this.config)
    console.log('entry', this.entry)
    console.log('entryId', this.entryId)
    console.log('root', this.root)
    console.log('modules', this.modules)
  }
}

module.exports = Compiler
