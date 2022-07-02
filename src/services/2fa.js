const crypto = require('crypto')
const b32Decode = require('base32-decode')

// 用户密钥
const K = b32Decode('6shyg3uens2sh5slhey3dmh47skvgq5y'.toUpperCase(), 'RFC4648')

// 时间戳计数器
const T = Math.floor(Date.now() / 1000 / 30)

/**
 * 数字转 Int64 字节流
 * @param {number} num 
 * @returns 
 */
function intToBytes(num) {
    var bytes = [];

    for (var i = 7; i >= 0; --i) {
        bytes[i] = num & (255);
        num = num >> 8;
    }

    return bytes;
}

// 计算 HMAC-SHA1，密钥为 K，消息为 T
const hmac = crypto.createHmac('sha1', K)

const T1 = Buffer.from(intToBytes(T))

const HS = hmac.update(T1).digest()

// 取出最后个字节的低 4 位
const offset = HS[19] & 0xf

// 将从 offset 开始的四个字节按大端组装为整数
let bytes = (HS[offset] & 0x7f /** 这里是为了忽略符号位 */) << 24
    | HS[offset + 1] << 16
    | HS[offset + 2] << 8
    | HS[offset + 3]

// 整数转字符串，然后取出后六位
let code = bytes.toString().slice(-6);

// 不足 6 位数则补 0
for (let i = 0; i > 6 - code.length; i++) {
    code = '0' + code;
}

// 打印用户验证码
console.log(code)