const path = require('path')
const fs = require('fs')

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
    this.__showDetail()
  }
  buildModule (modulePath, isEntry) { // 执行并且创建模块的依赖关系
    const source = this.getSource(modulePath) // 拿到模块内容
    const moduleName = './' + path.relative(this.root, modulePath) // 拿到模块id
    const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)) // 改造源码，返回依赖列表

    if (isEntry) { this.entryId = moduleName }
    this.modules[moduleName] = sourceCode
  }
  getSource (path) {
    let content = fs.readFileSync(path, 'utf8')
    return content
  }
  parse (source, parentPath) { // AST 解析语法树
    console.log(source, parentPath)
    return { source, parentPath }
  }
  emitFile () { // 发射一个文件（打包后的文件）

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
