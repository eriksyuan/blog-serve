const UserModel = require('../models/user')
const md5 = require('md5')

const register = async function (ctx, next) {
  console.log(ctx.request.body)
  let { userName, email, password } = ctx.request.body
  password = md5(password)

  await UserModel.register({ userName, email, password }).then(doc => {
    ctx.body = {
      status: 0,
      message: '注册成功',
      data: {}
    }
  }).catch(err => {
    if (err.code === 11000) {
      ctx.body = {
        status: 1,
        message: '用户名或者邮箱已存在，请重试',
        data: {}
      }
    } else {
      ctx.body = {
        status: 1,
        message: '错误',
        data: {}
      }
    }
  })
}

const login = async function (ctx, next) {
  let { email, password } = ctx.request.body
  password = md5(password)
  let res = {
    status: 1,
    message: '',
    data: {}
  }
  await UserModel.login({ email, password }).then(() => {
    res.status = 0
    res.message = '登陆成功'
  }).catch((err) => {
    if (err === 1) {
      res.message = '密码错误'
    } else if (err === 2) {
      res.message = '用户不存在，请先注册'
    } else {
      res.message = '未知错误'
    }
  })

  ctx.body = res
}



module.exports = [
  { 'method': 'post', 'path': '/api/register', 'fn': register },
  { 'method': 'post', 'path': '/api/login', 'fn': login }

]