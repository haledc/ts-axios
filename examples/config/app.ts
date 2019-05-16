/*
 * @Author: Hale
 * @Description: 测试默认配置 demo
 * @Date: 2019-05-16
 * @LastEditTime: 2019-05-17
 */
import axios, { AxiosTransformer } from '../../src'
import qs from 'qs'

// axios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: '321'
//   }
// })
//   .then(res => console.log(res.data))
//   .catch(err => console.log(err))

// axios({
//   transformRequest: [
//     function(data) {
//       return qs.stringify(data)
//     },
//     ...(axios.defaults.transformRequest as AxiosTransformer[])
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]),
//     function(data) {
//       if (typeof data === 'object') {
//         data.b = 2
//       }
//       return data
//     }
//   ],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// })
//   .then(res => console.log(res.data))
//   .catch(err => console.log(err))

const instance = axios.create({
  transformRequest: [
    function(data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
})
  .then(res => console.log(res.data))
  .catch(err => console.log(err))
