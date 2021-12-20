import { request } from '@/network/http';
import { contractConfig, ISWAP_VERSION, iSwapContractAbiConfig } from './swapConfig';
import Web3 from 'web3';
import { ETransfer } from '@/api/api';
import { ethers } from 'ethers';
import { sendRequest } from '@/network/cancelRequest';

const customUrl = 'https://api.iswap.com';

export default class ISwap {
  constructor({ chain }) {
    console.log(chain, 'chain');
    const transfer = new ETransfer();
    this.wallet = transfer.provider.getSigner();
    this.iSwapContractAddress = contractConfig[chain];
  }
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
    const res = await sendRequest({
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
      url: '/api/swap/order',
      data: params,
      customUrl
    });
    if (res.code === 0) {
      return res.data;
    }
    return null;
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
  /**
   * 链内兑换token->token ETH->token token->ETH
   * @param routerAddress 当前dex的routerAddress
   * @param amountIn 输入的金额
   * @param amountOutMin 最低收到
   * @param paths 路径
   * @param to 接收地址
   * @param deadline 过期时间
   * @param channel 当前的通道
   */
  _swapExactTokensForTokensSupportingFeeOnTransferTokens(routerAddress, amountIn, amountOutMin, paths, to, deadline, channel) {
    const contract = new ethers.Contract(this.iSwapContractAddress, iSwapContractAbiConfig, this.wallet);
    return contract.swapExactTokensForTokensSupportingFeeOnTransferTokens(routerAddress, amountIn, amountOutMin, paths, to, deadline, channel);
  }
  _swapExactETHForTokensSupportingFeeOnTransferTokens(routerAddress, amountIn, amountOutMin, paths, to, deadline, channel) {
    const contract = new ethers.Contract(this.iSwapContractAddress, iSwapContractAbiConfig, this.wallet);
    return contract.swapExactETHForTokensSupportingFeeOnTransferTokens(routerAddress, amountIn, amountOutMin, paths, to, deadline, channel);
  }
  _swapExactTokensForETHSupportingFeeOnTransferTokens(routerAddress, amountIn, amountOutMin, paths, to, deadline, channel) {
    const contract = new ethers.Contract(this.iSwapContractAddress, iSwapContractAbiConfig, this.wallet);
    return contract.swapExactTokensForETHSupportingFeeOnTransferTokens(routerAddress, amountIn, amountOutMin, paths, to, deadline, channel);
  }

  /**
   * 跨链兑换 token->token ETH->token
   * @param orderId 订单号
   * @param gasFee gas
   * @param crossChainFee 跨链手续费
   * @param dstChainId 目标链nativeId
   * @param channel 通道
   * @param srcPath 源链兑换地址
   * @param srcChainSwapCallData 源链编码数据
   * @param dstChainSwapInfo 目标链编码数据
   * @private
   */
  _swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain(orderId, gasFee, crossChainFee, dstChainId, channel, srcPath, srcChainSwapCallData, dstChainSwapInfo) {
    const contract = new ethers.Contract(this.iSwapContractAddress, iSwapContractAbiConfig, this.wallet);
    return contract.swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain(orderId, gasFee, crossChainFee, dstChainId, channel, srcPath, srcChainSwapCallData, dstChainSwapInfo);
  }
  _swapExactETHForTokensSupportingFeeOnTransferTokensCrossChain(orderId, gasFee, crossChainFee, dstChainId, channel, srcPath, srcChainSwapCallData, dstChainSwapInfo) {
    const contract = new ethers.Contract(this.iSwapContractAddress, iSwapContractAbiConfig, this.wallet);
    return contract.swapExactETHForTokensSupportingFeeOnTransferTokensCrossChain(orderId, gasFee, crossChainFee, dstChainId, channel, srcPath, srcChainSwapCallData, dstChainSwapInfo);
  }
}

export function encodeParameters(RPCUrl, parameter, type) {
  const web3 = new Web3(RPCUrl || window.ethereum);
  const ABI = web3.eth.abi;
  const deadlines = Math.floor((Date.now() + 1000 * 60 * 10) / 1000);
  if (type === 'src') {
    const { amount0In, amount0OutMin, fromAssetDex } = parameter;
    return ABI.encodeParameters(['address', 'uint256', 'uint256', 'uint256'], [fromAssetDex.routerAddress, amount0In, amount0OutMin, deadlines]);
  } else {
    const { amount0OutMin, fromAddress, toAssetDex } = parameter;
    return ABI.encodeParameters(['address', 'uint256', 'address'], [toAssetDex.routerAddress, amount0OutMin, fromAddress]);
  }
}
