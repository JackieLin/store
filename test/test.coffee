###
 * 测试
 * @author jackieLin <dashi_lin@163.com>
###

'use strict'

require 'should'
store = require '../dist/store'

describe '测试 store', -> 
    ###
     * 更新数据
    ###
    it '#updateall()', ->
        store.updateAll()

    ###
     * 测试删除方法
    ###
    it '#destory()', ->
        Object.keys(store.destroy()).length.should.equal 0
