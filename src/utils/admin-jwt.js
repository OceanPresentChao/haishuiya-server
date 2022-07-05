const jwt = require('jsonwebtoken'); // 引入验证jsonwebtoken模块
const expressJwt = require('express-jwt'); // 引入express-jwt模块
const { PRIVATE_KEY, JWT_Algorithm, TOKEN_PLACE } = require('./config'); // 引入自定义的jwt密钥

// 验证token是否过期

const jwtAuth = expressJwt.expressjwt({
    // 设置密钥
    secret: PRIVATE_KEY,
    // 设置为true表示校验，false表示不校验
    credentialsRequired: true,
    algorithms: [JWT_Algorithm],
    // 自定义获取token的函数
    getToken: (req) => {
        if (req.headers[TOKEN_PLACE]) {
            return req.headers[TOKEN_PLACE]
        } else if (req.query && req.query[TOKEN_PLACE]) {
            return req.query[TOKEN_PLACE]
        }
    }
    // 设置jwt认证白名单，比如/api/login登录接口不需要拦截
}).unless({
    path: [
        '/',
        '/api/login/',
        '/api/resetPwd/',
        '/api/clockOut/',
        '/api/getTicket/',
    ]
})

// jwt-token解析
function decode(req) {
    const token = req.get(TOKEN_PLACE)
    return jwt.verify(token, PRIVATE_KEY);
}

module.exports = {
    jwtAuth,
    decode
}

