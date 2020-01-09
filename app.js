const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')

const { secret } = require('./config/jwt')


const router = require('./routers')



const getJWTPayload = function (token) {
  return jwt.verify(token.split(' ')[1], secret)
}


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))



app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))



// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes


app.use(function (ctx, next) {
  return next().catch((err) => {
    if (err.status == 401) {
      ctx.status = 401
      ctx.body = 'token error'
    } else {
      throw err
    }
  })
})

app.use(koajwt({ secret }).unless({
  path: [/^\/admin\/login/,/^\/admin\/upload/,/^\/api/,/^\/images/]
}))

app.use(async (ctx, next) => {
  var token = ctx.headers.authorization;
  if (token == undefined) {
    await next();
  } else {
    let payload = getJWTPayload(ctx.headers.authorization)
    if (payload.name === 'yuan' & payload.exp > new Date / 1000) {
      await next()
    } else {
      return Promise.reject(Error({
        status: 401
      }))
    }
  }
})

app.use(router.routes())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
