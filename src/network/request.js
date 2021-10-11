import config from "./config";
import axios from 'axios';
let instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: config.headers
});
instance.interceptors.request.use(config => {
    return config;
});
instance.interceptors.response.use(res => {
    if (res.data.code === 200) {
        return res.data
    } else if (res.data.code === 500) {
        return res.data;
    } else {
        console.log('网络错误')
    }
});

export default instance;
