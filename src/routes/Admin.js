const express = require('express');
const router = express.Router();
const service = require('../services/index')
router.post('/login', function (req, res, next) {
    service.login(req, res, next).then(data => {
        res.status(200)
        res.send(data)
    }).catch(err => {
        res.status(400)
        res.send({ code: 400, message: String(err) });
        console.err(req.originalUrl, err);
    })
})

module.exports = router 