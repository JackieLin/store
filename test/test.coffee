###
 * 测试
 * @author jackieLin <dashi_lin@163.com>
###

'use strict'

require 'should'
store = require '../dist/store'

describe '测试 store', ->
    ###
     * 测试删除方法
    ###
    it '删除方法测试', ->
        Object.keys(store.destroy()).length.should.equal 0
