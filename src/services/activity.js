/*
 * @Author: OceanPresent
 * @E-mail: oceanpresent@163.com
 * @Date: 2022-02-22 08:21:18
 */
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)
const mongoose = require('mongoose');
const { processContent } = require("../utils/tool");
const { ActivityModel, getNewUserModel } = require("./database")

let ActivityInfo = new Map();


async function syncAllActivities() {
    return new Promise(async (resolve, reject) => {
        let actArr = await ActivityModel.find({}, { _id: 0, __v: 0 });
        ActivityInfo.clear();
        actArr.forEach((val) => {
            ActivityInfo.set(val.name, val);
        })
        console.log('syncAllActivities', ActivityInfo);
        resolve(true);
    })
}
//检查活动是否在期限内
function isActValid(actName) {
    return new Promise(async (resolve, reject) => {
        let activity = await ActivityModel.findOne({ name: actName }, { _id: 0, __v: 0 });
        let ans = dayjs().isBetween(dayjs(activity.startTime, 'YYYY年MM月DD日mm分'), dayjs(activity.during, 'YYYY年MM月DD日mm分'), 'minute', '[]');
        resolve(ans);
    });
}

module.exports = {
    syncAllActivities,
    getTicket(message) {
        return new Promise(async (resolve, reject) => {
            let response = { type: "抢票", code: 400, message: "" };
            let fromUserName = message.FromUserName;
            let msgArr = processContent(message.Content);
            let actName = msgArr[1] || '未命名活动';
            let actInfo = null;
            actInfo = ActivityInfo.get(actName);
            if (!actInfo || !actInfo.isGoing) {
                response.code = 401;
                resolve(response);
                return
            }//活动暂未开始
            if (actInfo.actCategory !== "抢票") {
                response.code = 405;
                resolve(response);
                return
            }//该活动不是抢票类型
            if (! await isActValid(actInfo.actName)) {
                response.code = 406;
                resolve(response);
                return
            }//活动不在期限内
            let userModel = getNewUserModel(actName);
            let resArr = await userModel.find({ name: fromUserName }, { _id: 0, __v: 0 });
            if (resArr.length) {
                response.code = 402;
                resolve(response);//抢过了
            } else {
                if (actInfo.num <= 0) {
                    response.code = 403;
                    resolve(response);
                    return
                }//票不够了
                await userModel.create({ name: fromUserName });
                actInfo.num--;
                await ActivityModel.updateOne({ name: actName }, { ticketNum: actInfo.num });
                response.code = 200;
                resolve(response);//抢票成功
                return
            }
        });
    },
    clockOut(message) {
        return new Promise(async (resolve, reject) => {
            let response = { code: undefined, totalDay: 0, type: "打卡", message: "" };
            let fromUserName = message.FromUserName;
            let msgArr = processContent(message.Content);
            let actName = msgArr[1] || '未命名活动';
            let actInfo = null;
            actInfo = ActivityInfo.get(actName);
            if (!actInfo || !actInfo.isGoing) {
                response.code = 401;
                resolve(response);
                return
            }//活动暂未开始
            if (actInfo.actCategory !== "打卡") {
                response.code = 404;
                resolve(response);
                return
            }//活动不是打卡活动
            if (! await isActValid(actInfo.actName)) {
                response.code = 406;
                resolve(response);
                return
            }//活动不在期限内
            let userModel = getNewUserModel(actName);
            let res = await userModel.find({ name: fromUserName }, { _id: 0, __v: 0 });
            if (res.length) {
                let obj = res[0];
                let lasttime = obj.lastTime;
                if (dayjs(lasttime, 'YYYY年MM月DD日mm分').isSame(dayjs(), "day")) {
                    response.code = 402;
                    resolve(response);//打过卡了
                    return
                } else {
                    let day = obj.day + 1;
                    response.totalDay = day;
                    await userModel.findOneAndUpdate({ name: fromUserName }, { day: day, lastTime: dayjs().format('YYYY年MM月DD日mm分') });
                    response.code = 403;
                    resolve(response);//新的一天打卡
                    return
                }
            } else {
                await userModel.create({ name: fromUserName, day: 1 });
                response.totalDay = 1;
                response.code = 403;
                resolve(response);//第一次打卡成功
                return
            }
        });
    },
    handleMenuEvent(eventkey) {
        const btnMsg = {
            Ya_2001: '如果有新奇的想法,想要我们帮忙做成活动或推送；亦或是关于吉大的所见所感、偶遇的美景、新奇的趣闻,都可以告诉我们(⑉°з°)-♡\
            \n文章、创意和图片请发送到微信jluhaishuiya或者微博@吉林大学还睡鸭,我们等你来撩哦',
            Ya_2002: '【商业合作要求】\
            \n1.商业推广只接受副推信息,主推不接广告。\
            \n2.宣传内容是要与学生相关的。\
            \n3.如需活动合作或者赞助请加微信详谈。\
            \n负责人：苑庭萱 微信：ytx072202',
            Ya_2003: '【活动推介申请要求】\
            \n1.该活动或者比赛必须由吉林大学校内社团主办或承办。\
            \n2.不为商家进行宣传（即使是赞助商信息）。\
            \n3.我们只再有主推的情况下在副推发活动推介,推送时间视主推而定,所以请提前（一周时间）联系我们。\
            \n4.推送位置有限,一周内统一社团不能连续发送活动推介。\
            \n5.还睡呀不帮忙撰写活动文案和排版编辑,请把最终版的活动推文发给我们,勿多次修改。这是帮忙但不是义务,请互相理解,感谢配合。\
            \n6.申请了原创的推送请先把吉林大学还睡呀加入白名单,允许转载,否则推送时发现将删除不推。\
            \n满足以上基本要求的联系：\
            \n负责人：\
            \n许瀞方 微信：xjf631787381\
            \n苑庭萱 微信：ytx072202',
        }
        return btnMsg[eventkey];
    },
    getActivityList(req) {
        return new Promise(async (resolve, reject) => {
            const { page, limit } = req.query;
            try {
                let total = await ActivityModel.count({});
                let actArr = await ActivityModel.find({}, { __v: 0 }, { skip: limit * (page - 1), limit: limit });
                resolve({ records: actArr, total, page, limit, size: actArr.length });
            } catch (error) {
                reject(error);
            }
        });
    },
    getActivity(req) {
        return new Promise(async (resolve, reject) => {
            const { _id } = req.query;
            const sid = mongoose.Types.ObjectId(_id);
            try {
                let actArr = await ActivityModel.findOne({ _id: sid }, { __v: 0 });
                resolve({ records: actArr, total: 1, size: 1 });
            } catch (error) {
                reject(error);
            }
        });
    },
    addActivity(req) {
        return new Promise(async (resolve, reject) => {
            const { actName, actCategory, isGoing, ticketNum, startTime, endTime, type } = req.body;
            const region = req.body.region || "暂未确定";
            const desc = req.body.desc || "无";
            //create函数返回一个promise
            if (ActivityInfo.has(actName)) { reject('该活动已经存在！'); return; }
            try {
                let promise = await ActivityModel.create({ category: actCategory, name: actName, isHold: isGoing, tickets: ticketNum, startTime, during: endTime, region, isOnline: type, desc });
                let newuserModel = getNewUserModel(actName);
                await newuserModel.init();
                console.log(`添加了活动${actName}`);
                syncAllActivities().catch(err => console.log(err));
                resolve(promise);
            } catch (error) {
                reject(error);
            }
        });
    },
    deleteActivity(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { actName } = req.query;
                await ActivityModel.deleteOne({ name: actName });
                let promise = await mongoose.connection.dropCollection(actName);
                syncAllActivities().catch(err => console.log(err));
                console.log(`删除了活动${actName}`);
                resolve(promise);
            } catch (err) {
                reject(err);
            }
        });
    },
    updateActivity(req) {
        return new Promise(async (resolve, reject) => {
            try {
                const { _id, actCategory, isGoing, startTime, endTime, type } = req.body;
                const region = req.body.region || "暂未确定";
                const desc = req.body.desc || "无";
                const ticketNum = req.body.ticketNum || 0;
                const sid = mongoose.Types.ObjectId(_id);
                console.log(`对id为${_id}的活动进行了修改`);
                await ActivityModel.updateOne({ _id: sid }, { actCategory, isGoing, startTime, endTime, ticketNum, region, type, desc }, { upsert: true }).catch(err => reject(err));
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },
    getActivityStatus(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let total = await ActivityModel.count({})
                let isGoingTotal = await ActivityModel.count({ isHold: true })
                resolve({ total, isGoingTotal })
            } catch (error) {
                reject(error)
            }
        });
    }
}




