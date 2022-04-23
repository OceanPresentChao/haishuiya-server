const express = require('express');
const router = express.Router();
const service = require('../service');
router.get('/activitylist', function (req, res) {
    service.getActivityList(req).then(data => {
        res.status(200);
        res.send({ code: 200, ...data })
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    });
});

router.get('/actstatus', function (req, res) {
    service.getActivityStatus(req).then(data => {
        res.status(200)
        res.send({ code: 200, preview: data })
    }).catch(err => {
        res.status(200)
        res.send({ code: 400, message: String(err) });
    })
})

router.get('/activity', function (req, res) {
    service.getActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, ...data })
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });

    });
});

router.post('/activity', function (req, res) {
    service.addActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, message: '提交成功！' });
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    })
})

router.delete('/activity', function (req, res) {
    service.deleteActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, message: '删除成功！' });
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    })
})

router.put('/activity', function (req, res) {
    service.updateActivity(req).then(data => {
        res.status(200);
        res.send({ code: 200, message: '更新成功！' });
    }).catch(err => {
        res.status(200);
        res.send({ code: 400, message: String(err) });
    })
})

module.exports = router;