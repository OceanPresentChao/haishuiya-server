const express = require('express');
const activityInfoRouter = require('./ActivityInfo');
const activityRouter = require('./Activity');
const adminRouter = require('./Admin')
const { jwtAuth, decode } = require('../utils/admin-jwt'); // 引入jwt认证函数
const router = express.Router(); // 注册路由
router.use((req, res, next) => {
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8',
        "haishuiya": true
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next();
    console.log(req.method, req.originalUrl, "params=", req.params, "query=", req.query, "body=", req.body)
})
router.use(jwtAuth)
router.use('/api', activityInfoRouter);
router.use('/api', activityRouter);
router.use('/api', adminRouter);

router.use((err, req, res, next) => {
    // 自定义用户认证失败的错误返回
    console.log('Router err===', err);
    if (err && err.name === 'UnauthorizedError') {
        const { status = 501, message } = err;
        // 抛出501异常
        res.status(status).json({
            code: status,
            msg: 'token失效，请重新登录',
            data: null
        })
    } else {
        const { output } = err || {};
        // 错误码和错误信息
        const errCode = (output && output.statusCode) || 500;
        const errMsg = (output && output.payload && output.payload.error) || err.message;
        res.status(errCode).json({
            code: errCode,
            msg: errMsg
        })
    }
})

router.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404-Not Found');
})
module.exports = router;