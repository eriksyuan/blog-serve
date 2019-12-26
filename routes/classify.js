var Classify = require('../models/classify')
const ArticleModel = require('../models/article')



// params:{
//     name:分类名称 String
// }
var addArCy = async (ctx, next) => {
    let res = {
        status: 1,
        message: '操作错误',
        data: {}
    };
    let { name } = ctx.request.body;
    if (name) {
        name = name.replace(/\s*/g, "");
    }
    await Classify.saveByName(name).then(data => {
        res = {
            status: 0,
            message: '创建成功',
            data: data
        }
    }).catch(err => {
        if (err == 'count') {
            res = {
                status: 1,
                message: '最多只能创建10条分类',
                data: {}
            }
        } else {
            res = {
                status: 1,
                message: '请不要重复设置相同的分类名',
                data: {}
            }
        }

    })
    ctx.body = res;
}

async function PromiseForEach(arr, cb) {
    let realResult = []
    let result = Promise.resolve()
    arr.forEach((a, index) => {
        result = result.then(() => {
            return cb(a).then((res) => {
                realResult.push(res)
            })
        })
    })
    await result
    return realResult
}

var getArCy = async (ctx) => {

    let res = {
        status: 1,
        message: '',
        data: {}
    }

    await Classify.findAll().then((doc) => {
        res = {
            status: 0,
            message: '',
            data: {
                classifyList: doc
            }
        }
    }).catch((err) => {

    })

    ctx.body = res
}

var changeArCy = async (ctx) => {
    let { newName, name } = ctx.request.body
    newName = newName.replace(/\s*/g, "");
    let res = {
        status: 1,
        message: '该名称已存在，请不要重复设置',
        data: {}
    }
    await Classify.changeName(name, newName).then((data) => {
        if (data) {
            res = {
                status: 0,
                message: '更改成功',
                data: data
            }
        } else {
            res = {
                status: 1,
                message: '未知错误',
                data: data
            }
        }
    }).catch((err) => {
        console.log(err)
    })
    ctx.body = res
}

const removeArCy = async function (ctx) {
    let { id } = ctx.request.body
    let res = {
        status: 1,
        message: '未知错误',
        data: {}
    }
    await Classify.deleteById(id).then((doc) => {
        if (!doc) {
            res = { status: 0, message: '删除成功', data: {} }
        } else {
            res = {
                status: 0,
                message: '删除成功，原来分类下文章已移动至'+doc.name,
                data: {}
            }
        }

    }).catch((err) => {
        if (err == 'count') {
            res = {
                status: 1,
                message: '你至少保留一个分类',
                data: {}
            }
        }
    })
    ctx.body = res
}


module.exports = [
    { 'method': 'post', 'path': '/api/admin/classify/addArCy', 'fn': addArCy },
    { 'method': 'get', 'path': '/api/admin/classify/getAll', 'fn': getArCy },
    { 'method': 'put', 'path': '/api/admin/changeArCy', 'fn': changeArCy },
    { 'method': 'delete', 'path': '/api/admin/classify/removeArCy', 'fn': removeArCy },
]