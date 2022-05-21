const MyDB = require('./database')
const ActService = require('./activity')
const AdminService = require('./admin')
function init() {
    MyDB.connectToDB().then(() => {
        ActService.syncAllActivities().catch(err => console.log(err));
        console.log("连接数据库成功");
    }).catch(err => {
        console.err("连接数据库失败", err);
    });
}
init()

module.exports = { ...ActService, ...AdminService }