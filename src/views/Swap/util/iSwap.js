import { request } from '@/network/http';
import { ISWAP_VERSION } from './swapConfig';
import Web3 from 'web3';

const customUrl = 'https://api.iswap.com';

export default class ISwap {
  async getRouterList() {
    const res = await request({
      url: '/api/common/router/list',
      method: 'get',
      data: { version: ISWAP_VERSION },
      customUrl,
      deleteLanguage: true
    });
    if (res.code === 0) {
      const dexConfig = {};
      const tempDexList = res.data;
      const chainIdList = res.data.map(item => Object.keys(item)).flat(Infinity);
      chainIdList.forEach((item, index) => {
        const tempDex = tempDexList[index];
        const dexNameList = tempDex[item].dex.map(item => item.dexName);
        const dexList = tempDex[item].dex;
        const nameList = Object.keys(tempDex[item].token);
        const tokenList = Object.values(tempDex[item].token);
        dexConfig[item] = {
          dex: {},
          defaultDex: {},
          token: {}
        };
        dexNameList.forEach((dex, _index) => {
          dexConfig[item]['dex'][dex] = dexList[_index];
          dexConfig[item]['defaultDex'] = dexList.find(item => item.isDefault === 1);
          dexConfig[item]['token'] = this.dexFormat(nameList, tokenList);
        });
      });
      return dexConfig;
    }
    return null;
  }
  // 获取iSwap费率信息
  async getEstimateFeeInfo(params) {
    const res = await request({
      url: '/api/swap/estimate-fee-info',
      data: params,
      customUrl
    });
    if (res.code === 0) {
      return res.data;
    }
    return null;
  }
  // 生成跨链swap订单
  async generateCrossChainSwapOrder(params) {
    const res = await request({
      url: '/api/swap/estimate-fee-info',
      data: params,
      customUrl
    });
    if (res.code === 0) {
      console.log(res.data);
    }
  }
  dexFormat(nameList, tokenList) {
    const tempData = {};
    tokenList.forEach((tokens, tIndex) => {
      tokens.forEach(token => {
        tempData[token] = nameList[tIndex];
      });
    });
    return tempData;
  }
}

export function encodeParameters(RPCUrl, parameter) {
  const { amount0In, amount0OutMin, deadline } = parameter;
  const web3 = new Web3(RPCUrl || window.ethereum);
  const ABI = web3.eth.abi;
  const deadlines = Math.floor((Date.now() + 1000 * 60 * 10) / 1000);
  // const amount0In = '100000000000000000000';
  // const amount0OutMin = '99000000000000000000';
  console.log(deadline, Date.now(), 'deadline');
  const parameterString = ABI.encodeParameters(['address', 'uint256', 'uint256', 'uint256'], ['0xED7d5F38C79115ca12fe6C0041abb22F0A06C300', amount0In, amount0OutMin, deadlines]);
  console.log(parameterString, 'parameterString');
  console.log(web3, '===web3===');
}
