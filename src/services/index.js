const MyDB = require('./database')
const ActService = require('./activity')

function init() {
    MyDB.connectToDB().then(() => {
        ActService.syncAllActivities().catch(err => console.log(err));
    });
}
init()

module.exports = { ...ActService }