/*
 * @Author: Hale
 * @Description: test entry
 * @Date: 2019-05-31
 * @LastEditTime: 2019-06-06
 */
const JasmineCore = require('jasmine-core')

// @ts-ignore
global.getJasmineRequireObj = function() {
  return JasmineCore
}

require('jasmine-ajax')
