/*
 * @Author: OceanPresent
 * @E-mail: oceanpresent@163.com
 * @Date: 2022-03-16 22:24:44
 */
const axios = require('axios');

axios({
    url: 'http://localhost:2777/api/activity',
    method: 'DELETE',
    params: {
        actName: '豆浆'
    },
}).then(res => { console.log(res.data); })

axios({
    url: 'http://localhost:2777/api/activity',
    method: 'POST',
    data: {
        actName: '豆浆',
        actCategory: '打卡',
        ticketNum: 10,
        isOpening: true,
        startTime: '111',
        endTime: '111',
    },
}).then(res => { console.log(res.data); })

axios({
    url: 'http://localhost:2777/api/activity',
    method: 'GET',
    params: {
        actCategory: '打卡',
        page: 1,
        limit: 5
    },
}).then(res => { console.log(res.data); })