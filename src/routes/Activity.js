const express = require('express');
const router = express.Router();
const service = require('../service');
router.post('/getTicket', function (req, res) {
    let msgInfo = req.body.message;
    // console.log(req);
    handler.getTicket(msgInfo).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    })
});

router.post('/clockOut', function (req, res) {
    let msgInfo = req.body.message;
    handler.clockOut(msgInfo).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    })
});

module.exports = router;