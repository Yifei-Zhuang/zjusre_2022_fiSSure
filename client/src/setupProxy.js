const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    'api',
    proxy({
      target: 'http://beet.asia:9200/doublec_pytorch/_search', // 你要访问的地址
      changeOrigin: true
    })
  )
}

