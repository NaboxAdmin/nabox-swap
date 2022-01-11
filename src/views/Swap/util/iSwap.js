import { request } from '@/network/http';
import { contractConfig, ISWAP_VERSION, iSwapContractAbiConfig, iSwapContractBridgeAbiConfig, contractBridgeConfig } from './swapConfig';
import Web3 from 'web3';
import { ETransfer } from '@/api/api';
import { ethers } from 'ethers';
import { sendRequest } from '@/network/cancelRequest';

const customUrl = 'https://api.iswap.com';

export default class ISwap {
  constructor({ chain }) {
    this.transfer = new ETransfer();
    this.wallet = this.transfer.provider.getSigner();
    this.iSwapContractAddress = contractConfig[chain];
    this.iSwapBridgeContractAddress = contractBridgeConfig[chain];
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
    return localStorage.getItem('iSwapConfig') && JSON.parse(localStorage.getItem('iSwapConfig')) || [];
  }
  // 获取iSwap限额信息
  async getTradeLimit(params) {
    const res = await sendRequest({
      method: 'get',
      url: '/api/common/trade/limit',
      data: params,
      customUrl
    });
    if (res.code === 0) {
      return res.data[0];
    }
    return null;
  }
  // 获取iSwap费率信息
  async getEstimateFeeInfo(params) {
    try {
      const res = await sendRequest({
        url: '/api/swap/estimate-fee-info',
        data: params,
        customUrl
      });
      if (res.code === 0) {
        return res.data;
      } else {
        throw ('Network Error');
      }
      return null;
    } catch (e) {
      throw e;
    }
  }
  // 获取iSwapBridge费率信息
  async getBridgeEstimateFeeInfo(params) {
    try {
      const res = await sendRequest({
        url: '/api/bridge/estimate-fee-info',
        data: params,
        customUrl
      });
      if (res.code === 0) {
        return {
          amount: res.data.amount.toString().split('.')[0],
          crossChainFee: res.data.fee.toString().split('.')[0],
          gasFee: res.data.gas.toString().split('.')[0]
        };
      } else {
        throw ('Network Error');
      }
      return null;
    } catch (e) {
      throw e;
    }
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
  // 生成跨链Bridge订单
  async generateCrossChainBridgeOrder(params) {
    const res = await request({
      url: '/api/bridge/order',
      data: params,
      customUrl
    });
    if (res.code === 0) {
      return res.data;
    }
    return null;
  }
  async getISwapOrderList(params) {
    const res = await sendRequest({
      method: 'get',
      url: '/api/swap/tx/list',
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
  async _swapExactTokensForTokensSupportingFeeOnTransferTokens(from, routerAddress, amountIn, amountOutMin, paths, to, deadline, channel) {
    console.log('==token->token==');
    const amount = ethers.utils.parseEther('0').toHexString();
    const iface = new ethers.utils.Interface(iSwapContractAbiConfig);
    const data = iface.functions.swapExactTokensForTokensSupportingFeeOnTransferTokens.encode([routerAddress, amountIn, amountOutMin, paths, to, deadline, channel]);
    const transactionParameters = await this.setGasLimit({
      from,
      to: this.iSwapContractAddress,
      value: amount,
      data
    });
    return await this.transfer.sendTransaction(transactionParameters);
  }
  async _swapExactETHForTokensSupportingFeeOnTransferTokens(from, routerAddress, amountOutMin, paths, to, deadline, channel, orderInfo) {
    console.log('==ETH->token==');
    const amount = ethers.utils.parseEther(orderInfo.amountIn).toHexString();
    const iface = new ethers.utils.Interface(iSwapContractAbiConfig);
    const data = iface.functions.swapExactETHForTokensSupportingFeeOnTransferTokens.encode([routerAddress, amountOutMin, paths, to, deadline, channel]);
    const transactionParameters = await this.setGasLimit({
      from,
      to: this.iSwapContractAddress,
      value: amount,
      data
    });
    return await this.transfer.sendTransaction(transactionParameters);
  }

  async _swapExactTokensForETHSupportingFeeOnTransferTokens(from, routerAddress, amountIn, amountOutMin, paths, to, deadline, channel) {
    console.log('==token->ETH==');
    const amount = ethers.utils.parseEther('0').toHexString();
    const iface = new ethers.utils.Interface(iSwapContractAbiConfig);
    const data = iface.functions.swapExactTokensForETHSupportingFeeOnTransferTokens.encode([routerAddress, amountIn, amountOutMin, paths, to, deadline, channel]);
    const transactionParameters = await this.setGasLimit({
      from,
      to: this.iSwapContractAddress,
      value: amount,
      data
    });
    return await this.transfer.sendTransaction(transactionParameters);
  }

  /**
   * 跨链兑换 token->token ETH->token
   * @param from 当前的用户地址
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
  async _swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain(from, encodeData) {
    console.log('==token->token==');
    console.log(encodeData, 'encodeData');
    const amount = ethers.utils.parseEther('0').toHexString();
    // const iface = new ethers.utils.Interface(iSwapContractAbiConfig);
    // const data = iface.functions.swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain.encode([orderId, gasFee, crossChainFee, dstChainId, channel, srcPath, srcChainSwapCallData, dstChainSwapInfo]);
    const transactionParameters = await this.setGasLimit({
      from,
      to: this.iSwapContractAddress,
      value: amount,
      data: encodeData
    });
    return await this.transfer.sendTransaction(transactionParameters);
  }
  async _swapExactETHForTokensSupportingFeeOnTransferTokensCrossChain(from, encodeData, orderInfo) {
    console.log('==cross: ETH->token==');
    const amount = ethers.utils.parseEther(orderInfo.amountIn).toHexString();
    const transactionParameters = this.setGasLimit({
      from,
      to: this.iSwapContractAddress,
      value: amount,
      data: encodeData
    });
    console.log(transactionParameters);
    return await this.transfer.sendTransaction(transactionParameters);
  }

  /**
   * @message 调用iSwapBridge大额跨链合约
   * @param fromAddress 用户地址
   * @param orderId 跨链订单id
   * @param asset 当前跨链资产合约地址
   * @param from from地址
   * @param to to地址
   * @param amount 跨链金额
   * @param gasFee gas
   * @param crossChainFee 跨俩手续费
   * @param rewards 奖励
   * @param srcChainId 源链id
   * @param dstChainId 目标链id
   * @param deadline 过期时间
   * @param channel 通道
   * @returns {Promise<*>}
   * @private
   */
  async _crossChainToken(fromAddress, orderId, asset, from, to, amount, gasFee, crossChainFee, rewards, srcChainId, dstChainId, deadline, channel) {
    console.log('==bridge: token->token==');
    const bridgeAmount = ethers.utils.parseEther('0').toHexString();
    const iface = new ethers.utils.Interface(iSwapContractBridgeAbiConfig);
    const data = iface.functions.crossChainToken.encode([orderId, asset, from, to, amount, gasFee, crossChainFee, rewards, srcChainId, dstChainId, deadline, channel]);
    const transactionParameters = this.setGasLimit({
      from: fromAddress,
      to: this.iSwapContractAddress,
      value: bridgeAmount,
      data
    });
    return await this.transfer.sendTransaction(transactionParameters);
  }

  async _crossChainETH(fromAddress, orderId, asset, from, to, amount, gasFee, crossChainFee, rewards, srcChainId, dstChainId, deadline, channel, orderInfo) {
    console.log('==bridge: ETH->token==');
    const bridgeAmount = ethers.utils.parseEther(orderInfo.amountIn).toHexString();
    const iface = new ethers.utils.Interface(iSwapContractBridgeAbiConfig);
    const data = iface.functions.crossChainETH.encode([orderId, asset, from, to, amount, gasFee, crossChainFee, rewards, srcChainId, dstChainId, deadline, channel]);
    const transactionParameters = this.setGasLimit({
      from: fromAddress,
      to: this.iSwapContractAddress,
      value: bridgeAmount,
      data
    });
    return await this.transfer.sendTransaction(transactionParameters);
  }

  /**
   * 生成交易序列化参数
   * @param method
   * @param params
   * @param amountIn
   * @param from
   * @returns {Promise<*&{gasLimit: *}>}
   */
  async generateParameters(method, params, amountIn, from) {
    const amount = ethers.utils.parseEther(amountIn).toHexString();
    const iface = new ethers.utils.Interface(iSwapContractAbiConfig);
    const data = iface.functions[method].encode(params);
    return this.setGasLimit({
      from,
      to: this.iSwapContractAddress,
      value: amount,
      data
    });
  }

  /**
   * 设置gasLimit
   * @param tx
   * @param tx.from {string} 用户地址
   * @param tx.to {string} 用户地址
   * @param tx.value {string} 用户地址
   * @param tx.data {string} 序列化Data
   * @returns {Promise<*&{gasLimit: *}>}
   */
  async setGasLimit(tx) {
    const gasLimit = await this.transfer.getGasLimit(tx);
    const tempTx = {
      ...tx,
      gasLimit
    };
    delete tempTx['from'];
    return tempTx;
  }
}

/**
 * 序列化iSwap请求参数
 * @param RPCUrl
 * @param parameter
 * @param type
 * @returns {*}
 */
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
