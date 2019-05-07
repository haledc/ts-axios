import axios, { AxiosError } from '../../src'

axios({
  method: 'get',
  url: '/error/get1'
})
  .then(res => console.log(res))
  .catch(err => console.log(err))

axios({
  method: 'get',
  url: '/error/get'
})
  .then(res => console.log(res))
  .catch(err => console.log(err))

// setTimeout
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}, 5000)

// timeout
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => console.log(res))
  .catch((err: AxiosError) => {
    // console.log('err =>', err)
    console.log(err.message)
    console.log(err.code)
  })
