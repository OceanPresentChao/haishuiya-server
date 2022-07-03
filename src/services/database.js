const mongoose = require('mongoose');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

let ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        default: '未命名活动',
    },
    ticket: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        default: "未知类型",
    },
    isHold: {
        type: Boolean,
        default: true,
    },
    startTime: {
        type: String,
        default: dayjs().format('YYYY年MM月DD日mm分')
    },
    during: {
        type: [String],
        default: [dayjs().format('YYYY年MM月DD日mm分'), dayjs().format('YYYY年MM月DD日mm分')]
    },
    isOnline: {
        type: Boolean,
        default: false
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