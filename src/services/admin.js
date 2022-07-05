const { getCode } = require('../utils/2fa')
const { PRIVATE_KEY, JWT_EXPIRED, JWT_Algorithm, TOKEN_PLACE } = require('../utils/config')
const jwt = require('jsonwebtoken')

function login(req, res, next) {
    return new Promise(async (resolve, reject) => {
        const { username, password } = req.query
        if (String(password) !== String(getCode())) {
            console.log(username, "登录失败", result.message);
            resolve({
                code: 401,
                message: "用户名或密码错误"
            })
        } else {
            const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: JWT_EXPIRED, algorithm: JWT_Algorithm })
            console.log(username, "登录成功");
            resolve({
                code: 200,
                data: { token, username },
                message: "登录成功"
            })
        }
    });
}

module.exports = { login }