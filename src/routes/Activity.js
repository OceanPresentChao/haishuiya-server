const express = require('express');
const router = express.Router();
const service = require('../services/index');
router.post('/getTicket', function (req, res) {
    let msgInfo = req.body.message;
    // console.log(req);
    service.getTicket(msgInfo).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    })
});

router.post('/clockOut', function (req, res) {
    let msgInfo = req.body.message;
    service.clockOut(msgInfo).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    })
});

module.exports = router;