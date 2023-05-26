import axios from 'axios';

const Qs = require('qs');
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
      console.log('已取消的重复请求：' + error.message);
    } else {
      // 添加异常处理
    }
    return Promise.reject(error);
  }
);

export async function sendRequest(params) {
  const { url, method = 'post', data, customUrl, isDODO } = params;
  const baseUrl = customUrl;
  if (isDODO) {
    axios.defaults.headers.get['user-agent'] = 'DODO-Bey';
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

