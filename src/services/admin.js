const { md5 } = require('../utils/md5')
// const { decode } = require('../utils/admin-jwt')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/config')
const jwt = require('jsonwebtoken')
const { AdminModel } = require('./database')

function login(req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            let result;
            const { userInfo } = req.body
            let password = md5(userInfo.password)
            const query = await AdminModel.findOne({ password, username: userInfo.username })
            if (query.length === 0) {
                result.code = 401//密码错误
                result.message = "用户名或密码错误"
                resolve(result)
            } else {
                result.code = 200
                result.message = "登录成功"
                const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: JWT_EXPIRED })
                const adminData = {
                    username: query[0].username
                }
                result.data = { token, adminData }
                resolve(result)
            }
        } catch (error) {
            reject(error)
        }
    });

}

module.exports = { login }