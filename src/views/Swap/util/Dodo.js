import { sendRequest } from '@/network/cancelRequest';
const dodoBaseUrl = 'https://route-api.dodoex.io/dodoapi';

class Dodo {
  async getDodoRoute(params) {
    const data = {
      fromTokenAddress: '',
      fromTokenDecimals: ''
      toTokenAddress: '',
      toTokenDecimals: '',
      fromAmount: '',
      slippage: '',
      userAddr: '',
      chainId: '',
      rpc: '' // 当前的rpc地址
    };
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/getdodoroute',
        data: params,
        customUrl: dodoBaseUrl
      });
      if (res.status === 200) {
        return res.data;
      } else {
        throw 'Network Error';
      }
    } catch (e) {
      throw e;
    }
  }
}
