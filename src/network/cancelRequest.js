import axios from 'axios';

const Qs = require('qs');
const CryptoJS = require('crypto-js');
const pendingRequest = new Map();
axios.defaults.headers.post['Content-Type'] = 'application/json';

function generateReqKey(config) {
  const { method, url, params } = config;
  // Qs.stringify(data);
  return [method, url, Qs.stringify(params)].join('&');
}

function addPendingRequest(config) {
  const requestKey = generateReqKey(config);
  config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
          if (!pendingRequest.has(requestKey)) {
            pendingRequest.set(requestKey, cancel);
          }
        });
}

function removePendingRequest(config) {
  const requestKey = generateReqKey(config);

  if (pendingRequest.has(requestKey) && (requestKey.indexOf('/swap/swft/multi/quote') > -1 || requestKey.indexOf('/quote?fromTokenAddress=') > -1)) {
    const cancel = pendingRequest.get(requestKey);
    cancel(requestKey);
    pendingRequest.delete(requestKey);
  }
}

axios.interceptors.request.use(
  function(config) {
    removePendingRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
    addPendingRequest(config); // 把当前请求添加到pendingRequest对象中
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config); // 从pendingRequest对象中移除请求
    return response;
  },
  (error) => {
    removePendingRequest(error.config || {}); // 从pendingRequest对象中移除请求
    if (axios.isCancel(error)) {
      console.log('cancel request：' + error.message);
    } else {
      // 添加异常处理
    }
    return Promise.reject(error);
  }
);
function appendDataToURL(path, data) {
  const params = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
  }
  const queryString = params.join('&');
  return path + '?' + queryString;
}

export async function sendRequest(params) {
  const { url, method = 'post', data, customUrl, isDODO, isOKX = false, OKXApiKey = '99e1441f-b501-4f99-8a2b-95e7c5cb0878' } = params;
  const baseUrl = customUrl;
  if (isDODO) {
    axios.defaults.headers.get['user-agent'] = 'DODO-nabox';
  }
  if (isOKX) {
    axios.defaults.headers['OK-ACCESS-KEY'] = OKXApiKey || '';
    const currentTime = new Date();
    const utcTimeString = currentTime.toISOString();
    const signStr = `${utcTimeString}${method === 'post' && 'POST' || 'GET'}${appendDataToURL(url, data)}`;
    const OKXSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(signStr, '29D5577274E39F0780368247974E381A'));
    axios.defaults.headers['OK-ACCESS-TIMESTAMP'] = utcTimeString || '';
    axios.defaults.headers['OK-ACCESS-SIGN'] = OKXSign || '';
    axios.defaults.headers['OK-ACCESS-PASSPHRASE'] = 'zhANG.18423208715' || '';
  } else {
    delete axios.defaults.headers['OK-ACCESS-KEY'];
    delete axios.defaults.headers['OK-ACCESS-TIMESTAMP'];
    delete axios.defaults.headers['OK-ACCESS-SIGN'];
    delete axios.defaults.headers['OK-ACCESS-PASSPHRASE'];
  }
  const newData = method === 'post' ? { data: { ...data }} : { params: { ...data }};
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

