/*
 * @Author: Hale
 * @Description: test axios all and spread
 * @Date: 2019-06-03
 * @LastEditTime: 2019-06-03
 */

import axios from '../src'

describe('static', () => {
  test('should support all', done => {
    let isFulfilled = false

    axios
      .all([true, true])
      .then(args => {
        isFulfilled = args[0]
      })
      .catch(error => console.log(error))

    setTimeout(() => {
      expect(isFulfilled).toBeTruthy()
      done()
    }, 100)
  })

  test('should support spread', done => {
    let sum = 0
    let isFulfilled = false
    let result: any

    axios
      .all([123, 456])
      .then(
        axios.spread((a, b) => {
          sum = a + b
          isFulfilled = true
          return 'hello world'
        })
      )
      .then(res => (result = res))
      .catch(error => console.log(error))

    setTimeout(() => {
      expect(isFulfilled).toBeTruthy()
      expect(sum).toBe(123 + 456)
      expect(result).toBe('hello world')
      done()
    }, 100)
  })
})
