const MyDB = require('./database')
const ActService = require('./activity')
const AdminService = require('./admin')
function init() {
    MyDB.connectToDB().then(() => {
        ActService.syncAllActivities().catch(err => console.log(err));
    });
}
init()

module.exports = { ...ActService, ...AdminService }