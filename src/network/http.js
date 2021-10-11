import instance from "./request";

const qs = require('querystring');//序列化数据
export default {
    get(url, params = {}) {
        return new Promise(((resolve, reject) => {
            instance.get(url, { params }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        }))
    },
    post(url, params = {}) {
        return new Promise(((resolve, reject) => {
            instance.post(url, qs.stringify(params), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        }))
    }
}
