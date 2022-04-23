const express = require('express');
const activityInfoRouter = require('./ActivityInfo');
const activityRouter = require('./Activity');
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
        "HaiShuiYa": true
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next();
})

router.use('/api', activityInfoRouter);
router.use('/api', activityRouter);

router.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404-Not Found');
})
module.exports = router;