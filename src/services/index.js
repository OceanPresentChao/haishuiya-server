const MyDB = require('./database')
const ActService = require('./activity')
const AdminService = require('./admin')
function initDB() {
    MyDB.connectToDB().then(() => {
        ActService.syncAllActivities().catch(err => console.log(err));
        console.log("连接数据库成功");
    }).catch(err => {
        console.err("连接数据库失败", err);
    });
}
initDB()

module.exports = { ...ActService, ...AdminService }