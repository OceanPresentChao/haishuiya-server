const mongoose = require('mongoose');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)
const DATABASE_URL = "mongodb://localhost:27017/haishuiya";
let ActivitySchema = new mongoose.Schema({
    actName: {
        type: String,
        default: '未命名活动',
    },
    ticketNum: {
        type: Number,
        default: 0,
    },
    actCategory: {
        type: String,
        default: "未知类型",
    },
    isGoing: {
        type: Boolean,
        default: true,
    },
    startTime: {
        type: String,
        default: dayjs().format('YYYY年MM月DD日mm分')
    },
    endTime: {
        type: String,
        default: dayjs().format('YYYY年MM月DD日mm分')
    },
    type: {
        type: String,
        default: '线上'
    },
    region: {
        type: String,
        default: '未知地点'
    },
    desc: {
        type: String,
        default: '无'
    }
});
exports.ActivityModel = mongoose.model('activity', ActivitySchema);

UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '未命名用户',
    },
    day: {
        type: Number,
        default: 0,
    },
    lastTime: {
        type: String,
        default: dayjs().format('YYYY年MM月DD日mm分')
    }
});

exports.connectToDB = function () {
    return new Promise(async (resolve, reject) => {
        mongoose.connection.once('open', () => { console.log('connection established!'); });
        mongoose.connection.once('close', () => { console.log('connection disconnected!'); })
        await mongoose.connect(DATABASE_URL);
        resolve();
    });

}

exports.getNewUserModel = function (name) {
    return mongoose.model(name, UserSchema);
}