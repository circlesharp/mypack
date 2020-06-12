#! /usr/bin/env node

const path = require('path')
const Compiler = require('../lib/Compiler')
const config = require(path.resolve('webpack.config.js')) // 引入 config

const compiler = new Compiler(config)

compiler.hooks.entryOption.call()

// 标识运行编译
compiler.run()
