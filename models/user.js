const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  lastIp: {
    type: String
  },
  userName: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  lastLoginTime: {
    type: Date
  },
  password: {
    type: String,
    require: true
  },
  avator: {
    type: String,
    default: ''
  },
  status:{
    type:Number,
    default:1
  },
  acticCode:{
    type:String,
  },
  registerTime:{
    type:Date,
    default:Date.now
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
    }
  ]
})


userSchema.statics.register = function ({ email, userName, password }) {
  let that = this
  return new Promise(function (resolve, reject) {
    that.create({ email, userName, password }, function (err, doc) {
      if (err) reject(err)
      resolve(doc)
    })
  })
}


//登录  err=1:密码错误，err=2:用户不存在
userSchema.statics.login = function ({ email, password }) {
  let that = this
  return new Promise(function (resolve, reject) {
    that.findOne({ email }, 'password', function (err, doc) {
      if (err) reject(err)
      if (doc) {
        if (doc.password == password) {
          resolve()
        } else {
          reject(1)
        }
      } else {
        reject(2)
      }
    })
  })

}



const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel