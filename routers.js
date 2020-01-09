const fs = require('fs')
const Router = require('koa-router')

const router = Router()

var files = fs.readdirSync(__dirname + '/routes')
const { host } = require('./config')

console.log(files)

var js_files = files.filter((f) => {
    return f.endsWith('.js')
})


for (let file of js_files) {
    let map = require(__dirname + '/routes/' + file)
    for (let fn of map) {
        router[fn.method](fn.path, fn.fn)
    }
}

const upload = require('./routes/other/upload')

router.post('/admin/upload', upload.single('file'), ctx => {
    let realHost = ''


    if (process.env.NODE_ENV === 'development') {
        realHost = 'http://localhost:3000'
    } else {
        realHost = host.cdn
    }
    ctx.body = {
        status: 0,
        message: '上传成功',
        data: {
            file: realHost + '/images/' + ctx.req.file.filename
        }
    }
})

module.exports = router