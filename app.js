const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());// 解析json数据格式
app.use(bodyParser.urlencoded({ extended: true })); // 解析form表单提交的数据application/x-www-form-urlencoded
app.use('/', cors());
app.use('/', routes);

module.exports = app