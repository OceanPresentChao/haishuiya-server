const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const bodyParser = require('body-parser')

const app = express();
const port = 2777;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', cors());
app.use('/', routes);

app.listen(port, () => { console.log(`服务器已启动','http://localhost:${port}`); })