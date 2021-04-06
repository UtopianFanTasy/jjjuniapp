/*
	发送http请求
	参数：   url  	String类型   请求地址
			method 	String类型    请求方式       GET或POST
			data    Object类型    提交的数据     {username:'张三',age:21}
	
*/

import {baseUrl} from "./config.js"
function http(url,method="GET",data={},header={}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url:baseUrl+url,
			method,
			data,
			header,
			success: res => {
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		})
	})

}

export {http}
