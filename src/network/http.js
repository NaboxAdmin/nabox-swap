import axios from 'axios';
import * as config from '@/config.js';

axios.defaults.headers.post['Content-Type'] = 'application/json';
/**
 * 封装post请求
 * Encapsulation post method
 * @param url
 * @param methodName
 * @param data
 * @returns {Promise}
 */
export function post(url, methodName, data = []) {
  return new Promise((resolve, reject) => {
    const params = { 'jsonrpc': '2.0', 'method': methodName, 'params': data, 'id': Math.floor(Math.random() * 1000) };
    axios.post(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      });
  });
}

export async function request(params) {
  const { url, method = 'post', data, customUrl } = params;
  const baseUrl = customUrl || config.SWAP_BOX_API_URL;
  const language = localStorage.getItem('locale') === 'cn' ? 'CHS' : 'EN';
  let newData;
  if (!customUrl) {
    newData = method === 'post' ? { data: { language, ...data }} : { params: { language, ...data }};
  } else {
    newData = method === 'post' ? { data: { ...data }} : { params: { ...data }};
  }
  return new Promise((resolve, reject) => {
    axios({ url: baseUrl + url, method: method, ...newData }).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

