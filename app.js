const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', cors());
app.use('/', routes);

module.exports = app