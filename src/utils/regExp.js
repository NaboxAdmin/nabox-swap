//验证手机号
const checkPhone = (phone)=>{
	if(!(/^1[3456789]\d{9}$/.test(phone))) return false
};
//验证验证码
const checkCaptcha = (captcha)=>{
	if(!(/\d{6}$/.test(captcha))) return false
};
//验证支付密码
const checkPayPassword = (password)=>{
	if(!(/\d{6}$/.test(password))) return false
};
//验证密码
const checkPassword = (password)=>{
	if(!(/\w{6,20}$/.test(password))) return false
};
//验证邮箱
const checkEmail = (email)=>{
	if(!(/[a-zA-Z0-9_-]+$/.test(email))) return false
};
//验证身份证号
const checkIdcard = (Idcard)=>{
	if(!(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(Idcard))) return false
};

// 验证链接地址
const checkUrl = (url) => {
	if(!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(url))) return false
}

export {
	checkPhone,
	checkCaptcha,
	checkPassword,
	checkPayPassword,
	checkEmail,
	checkIdcard,
	checkUrl
}
