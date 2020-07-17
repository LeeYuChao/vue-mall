/**
 * 过滤特殊字符
 */
export function filterStr(str) { 
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    var rs = ""; 
    for (var i = 0; i < str.length; i++) { 
        rs = rs+str.substr(i, 1).replace(pattern, ''); 
    }
    return rs; 
}
/**
 * 验证邮箱
 */
export function validateEmall(value){
    let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
    return !reg.test(value) ? true : false;
}
/**
 * 验证密码为6至20位数字+字母
 */
export function validatePassword(value){
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    return !reg.test(value) ? true : false;
}
/**
 * 验证验证码
 */
export function validateCode(value){
    let reg = /^[a-z0-9]{6}$/;
    return !reg.test(value) ? true : false;
}