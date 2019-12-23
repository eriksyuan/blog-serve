const {secret,payload} = require('../config/jwt')

const jwt = require('jsonwebtoken')

const token = jwt.sign(payload,secret,{expiresIn:'7d'})


module.exports = token
