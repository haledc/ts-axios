/*
 * @Author: Hale
 * @Description: server
 * @Date: 2019-05-16
 * @LastEditTime: 2019-05-31
 */
const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')
const multiparty = require('connect-multiparty')
const cookieParser = require('cookie-parser')
const path = require('path')
const atob = require('atob')

require('./server2')

const app = express()
const router = express.Router()
const compiler = webpack(webpackConfig)

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
)

app.use(webpackHotMiddleware(compiler))

app.use(
  express.static(__dirname, {
    setHeaders(res) {
      res.cookie('XSRF-TOKEN-D', '123abc')
    }
  })
)

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(multiparty({
  upload: path.resolve(__dirname, 'upload-file')
}))

registerSimpleRouter()
registerBaseRouter()
registerErrorRouter()
registerExtendRouter()
registerInterceptorRouter()
registerConfigRouter()
registerCancelRouter()
registerMoreRouter()

app.use(router)

const port = process.env.PORT || 3000

module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost: ${port}, Ctrl+c to stop.`)
})

// ------ router ------

function registerSimpleRouter() {
  router.get('/simple/get', (req, res) => {
    res.json({
      msg: 'hello world'
    })
  })
}

function registerBaseRouter() {
  router.get('/base/get', (req, res) => {
    res.json(req.query)
  })

  router.post('/base/post', (req, res) => {
    res.json(req.body)
  })

  router.post('/base/buffer', (req, res) => {
    let msg = []

    req.on('data', chunk => {
      if (chunk) msg.push(chunk)
    })

    req.on('end', () => {
      let buf = Buffer.concat(msg)
      res.json(buf.toJSON())
    })
  })
}

function registerErrorRouter() {
  router.get('/error/get', (req, res) => {
    if (Math.random() > 0.5) {
      res.json({
        msg: 'hello world'
      })
    } else {
      res.status(500)
      res.end()
    }
  })

  router.get('/error/timeout', (req, res) => {
    setTimeout(() => {
      res.json({
        msg: 'hello world'
      })
    }, 3000)
  })
}

function registerExtendRouter() {
  router.get('/extend/get', (req, res) => {
    res.json({
      msg: 'get'
    })
  })

  router.options('/extend/options', (req, res) => {
    res.json({
      msg: 'options'
    })
  })

  router.delete('/extend/delete', (req, res) => {
    res.json({
      msg: 'delete'
    })
  })

  router.head('/extend/head', (req, res) => {
    res.end()
  })

  router.post('/extend/post', (req, res) => {
    res.json(req.body)
  })

  router.put('/extend/put', (req, res) => {
    res.json(req.body)
  })

  router.patch('/extend/patch', (req, res) => {
    res.json(req.body)
  })

  router.get('/extend/user', (req, res) => {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: 18
      }
    })
  })
}

function registerInterceptorRouter() {
  router.get('/interceptor/get', (req, res) => {
    res.end('hello')
  })
}

function registerConfigRouter() {
  router.post('/config/post', (req, res) => {
    res.json(req.body)
  })
}

function registerCancelRouter() {
  router.get('/cancel/get', (req, res) => {
    setTimeout(() => {
      res.json('hello')
    }, 1000)
  })

  router.post('/cancel/post', (req, res) => {
    setTimeout(() => {
      res.json(req.body)
    }, 1000)
  })
}

function registerMoreRouter() {
  router.get('/more/get', (req, res) => {
    res.json(req.cookies)
  })

  router.post('/more/upload', (req, res) => {
    console.log(req.body, req.files)
    res.end('upload success!')
  })

  router.post('/more/post', (req, res) => {
    const auth = req.headers.authorization
    const [type, credentials] = auth.split(' ')
    console.log(atob(credentials))
    const [username, password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'hale' && password === '123456') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end('UnAuthorization')
    }
  })

  router.get('/more/304', (req, res) => {
    res.status(304)
    res.end()
  })

  router.get('/more/A', (req, res) => {
    res.end('A')
  })

  router.get('/more/B', (req, res) => {
    res.end('B')
  })
}