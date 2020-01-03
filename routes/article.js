const ArticleModel = require('../models/article')

const { getClientIp } = require('../utils/util')

//新建（更改）文章
const createNewArticle = async function (ctx, next) {
    var res = {
        status: 1,
        message: '',
        data: {}
    }
    let { id, classifyId, title, content, issue, image, description } = ctx.request.body;
    await ArticleModel.creatNewArticle(id, classifyId, title, content, issue, image, description).then(data => {
        res = {
            status: 0,
            message: '创建成功',
            data: data
        }
    }).catch(err => {
        console.log(err)
    })
    ctx.body = res
}

//删除文章
const remove = async function (ctx, next) {
    var res = {
        status: 1,
        message: '',
        data: {}
    }
    let { id } = ctx.request.body

    await ArticleModel.removeById(id).then((r) => {
        res = {
            status: 0,
            message: '删除成功',
            data: r
        }
    }).catch((err) => {
        res.message = err
    })

    ctx.body = res
}
//更改文章
const changeArticle = async function (ctx, next) {
    var res = {
        status: 1,
        message: '',
        data: {}
    }
    let { id, content, title, issue, image, classifyId, description } = ctx.request.body

    await ArticleModel.changeArticle(id, { content, title, issue, image, classify: classifyId, description }).then((r) => {
        res = {
            status: 0,
            message: '更改成功',
            data: r
        }

    })
    ctx.body = res
}


const getArticles = async function (ctx, next) {
    var res = {
        status: 1,
        message: '',
        data: {}
    }
    let { pageNo, pageSize, classify, issue, keyword, sortField, sortOrder } = ctx.query
    let sort = {}
    let skip = {}
    let obj = { classify, issue }
    if (sortField) {
        switch (sortOrder) {
            case 'ascend':
                sort[sortField] = 1
                break;
            case 'descend':
                sort[sortField] = -1
                break;
            default:
                break;
        }
    }
    if (pageNo) {
        skip = {
            page: Number(pageNo) - 1,
            num: Number(pageSize)
        }
    }
    await ArticleModel.fifterArticle(keyword, obj, skip, sort).then(arts => {
        res = {
            status: 0,
            message: '获取成功',
            data: {
                pageSize: Number(pageSize),
                pageNo: Number(pageNo),
                totalCount: arts[0],
                totalPage: arts[0] / pageSize,
                data: arts[1]
            }
        }
    })
    ctx.body = res
}

const getArticlesOfIssue = async function (ctx, next) {
    var res = {
        status: 1,
        message: '',
        data: {}
    }

    await ArticleModel.getAllArticlesOfIssue().then((doc) => {
        res = {
            status: 0,
            message: '获取成功',
            data: {
                articles: doc
            }
        }
    })
    ctx.body = res
}

const getDetail = async function (ctx, next) {
    let { id } = ctx.query
    console.log(getClientIp(ctx.req))
    var res = {
        status: 1,
        message: '',
        data: {}
    }
    await ArticleModel.getDetail(id).then(data => {
        res = {
            status: 0,
            message: '获取成功',
            data: data
        }
    }).catch(err => {
        res.message = '错误'
    })

    ctx.body = res
}

const adminGetDetail = async function (ctx, next) {
    let { id } = ctx.query
    var res = {
        status: 1,
        message: '',
        data: {}
    }
    await ArticleModel.adminGetDetail(id).then(data => {
        res = {
            status: 0,
            message: '获取成功',
            data: data
        }
        console.log(res)
    }).catch(e => {
        console.log(e)
    })
    console.log(res)
    ctx.body = res
}

module.exports = [
    { 'method': 'post', 'path': '/admin/article/createNew', 'fn': createNewArticle },
    { 'method': 'delete', 'path': '/admin/article/remove', 'fn': remove },
    { 'method': 'put', 'path': '/admin/article/change', 'fn': changeArticle },
    { 'method': 'get', 'path': '/admin/article/getDetail', 'fn': adminGetDetail },
    { 'method': 'get', 'path': '/admin/article/getArticles', 'fn': getArticles },
    { 'method': 'get', 'path': '/api/articles', 'fn': getArticlesOfIssue },
    { 'method': 'get', 'path': '/api/detail', 'fn': getDetail },
]