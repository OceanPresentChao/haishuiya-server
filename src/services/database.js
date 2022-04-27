const mongoose = require('mongoose');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

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

let AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        default: 'admin'
    },
    password: {
        type: String,
        required: true
    }
})

let UserSchema = new mongoose.Schema({
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

exports.AdminModel = mongoose.model('admin', AdminSchema)
exports.ActivityModel = mongoose.model('activity', ActivitySchema);
exports.connectToDB = function () {
    return new Promise(async (resolve, reject) => {
        const DATABASE_URL = "mongodb://127.0.0.1:27017/haishuiya";
        mongoose.connection.once('open', () => { console.log('connection established!'); });
        mongoose.connection.once('close', () => { console.log('connection disconnected!'); })
        try {
            await mongoose.connect(DATABASE_URL);
            resolve();
        } catch (error) {
            reject(error)
        }
    });
}

exports.getNewUserModel = function (name) {
    return mongoose.model(name, UserSchema);
}