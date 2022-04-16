/*
 * @Author: OceanPresent
 * @E-mail: oceanpresent@163.com
 * @Date: 2022-02-22 08:19:24
 */
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')
const app = express();
const handler = require('./src/handler');
const port = 2777;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', cors());
app.use((req, res, next) => {
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next();
})

app.post('/api/getTicket', function (req, res) {
    let msgInfo = req.body.message;
    // console.log(req);
    handler.getTicket(msgInfo).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
        console.log("Error:", err);
    })
});

app.post('/api/clockOut', function (req, res) {
    let msgInfo = req.body.message;
    handler.clockOut(msgInfo).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
        console.log("Error:", err);
    })
});

app.get('/api/activity', function (req, res) {
    handler.getActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, ...data })
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
        console.log("Error:", err);
    });
});

app.post('/api/activity', function (req, res) {
    handler.addActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, message: '提交成功！' });
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
        console.log("Error:", err);
    })
})

app.delete('/api/activity', function (req, res) {
    handler.deleteActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, message: '删除成功！' });
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
        console.log("Error:", err);
    })
})

app.put('/api/activity', function (req, res) {
    handler.updateActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, message: '更新成功！' });
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
        console.log("Error:", err);
    })
})

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404-Not Found');
})
app.listen(port, () => { console.log(`服务器已启动','http://localhost:${port}`); })