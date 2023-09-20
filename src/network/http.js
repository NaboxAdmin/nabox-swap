import axios from 'axios';
import * as config from '@/config.js';
import { isBeta } from '@/api/util';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 15000;
/**
 * 封装post请求
 * Encapsulation post method
 * @param url
 * @param methodName
 * @param data
 * @param isTron
 * @returns {Promise}
 */
export function post(url, methodName, data = [], isTron = false) {
  return new Promise((resolve, reject) => {
    const params = { 'jsonrpc': '2.0', 'method': methodName, 'params': data, 'id': Math.floor(Math.random() * 1000) };
    if (isTron) axios.defaults.headers.post['tron-pro-api-key'] = '2b7aa75d-c12d-4520-b0f1-784aeb2ec0cf';
    axios.post(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      });
  });
}

export async function request(params) {
  const { url, method = 'post', data, customUrl, isTRON, apiKey } = params;
  const baseUrl = customUrl || config.SWAP_BOX_API_URL;
  const language = localStorage.getItem('locale') === 'cn' ? 'CHS' : 'EN';
  let newData;
  if (!customUrl) {
    newData = method === 'post' ? { data: { language, ...data }} : { params: { language, ...data }};
  } else {
    newData = method === 'post' ? { data: { ...data }} : { params: { ...data }};
  }
  if (isTRON && !isBeta) {
    axios.defaults.headers.post['TRON-PRO-API-KEY'] = apiKey || '29bb955e-81b8-450d-ab45-1e0f641f19e0';
  }
  if (axios.defaults.headers['OK-ACCESS-TIMESTAMP']) {
    delete axios.defaults.headers['OK-ACCESS-KEY'];
    delete axios.defaults.headers['OK-ACCESS-TIMESTAMP'];
    delete axios.defaults.headers['OK-ACCESS-SIGN'];
    delete axios.defaults.headers['OK-ACCESS-PASSPHRASE'];
  }
  if (axios.defaults.headers.get['user-agent']) {
    delete axios.defaults.headers.get['user-agent'];
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

