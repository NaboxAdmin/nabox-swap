import { sendRequest } from '@/network/cancelRequest';
import { divisionDecimals, Minus } from '@/api/util';
import { ethers } from 'ethers';
import {ETransfer} from "@/api/api";

const inchBaseUrl = 'https://api.1inch.io/v4.0/';

export default class Inch {
  constructor({ nativeId }) {
    this.nativeId = nativeId;
  }

  /**
   * @desc 获取1inch询价信息
   * @param params { Object }
   * @param params.fromTokenAddress { string } 源链资产合约地址
   * @param params.toTokenAddress { string } 目标链资产合约地址
   * @param params.amount  { string } 目标链资产数量
   * @param params.fee  { string } 收取手续费比例
   * @returns {Promise<{toAmount: (*|string)}>}
   */
  async get1inchRouteQuote(params) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/quote',
        data: params,
        customUrl: `${inchBaseUrl}${this.nativeId}`
      });
      if (res && res.estimatedGas) {
        return {
          toAmount: divisionDecimals(res.toTokenAmount, res.toToken && res.toToken.decimals || 18)
        };
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * @desc 获取1inch资产授权额度
   * @param params { Object }
   * @param params.tokenAddress { string } 需要查询的资产合约地址
   * @param params.walletAddress { string } 需要查询授权的用户地址
   * @returns {Promise<boolean>}
   */
  async get1inchAssetAllowance(params) {
    const res = await sendRequest({
      method: 'get',
      url: '/approve/allowance',
      data: params,
      customUrl: `${inchBaseUrl}${this.nativeId}`
    });
    const baseAllowance = '10000';
    if (res && res.allowance) {
      return Minus(res.allowance, baseAllowance) < 0;
    }
    return true;
  }
  /**
   * @desc 获取授权数据，发送授权交易
   * @param params { Object }
   * @param params.tokenAddress { string } 需要授权的资产合约地址
   * @returns {Promise<void>}
   */
  async get1inchApproveTransactionData(params) {
    const res = await sendRequest({
      method: 'get',
      url: '/approve/transaction',
      data: params,
      customUrl: `${inchBaseUrl}${this.nativeId}`
    });
    return {
      ...res,
      gasPrice: ethers.utils.hexlify(Number(res.gasPrice)),
      value: ethers.utils.hexlify(Number(res.value))
    };
  }
  /**
   * @desc 获取1inch swap信息并发送交易
   * @param params { Object }
   * @param address { string }
   * @param params.fromTokenAddress { string } 源链资产合约地址
   * @param params.toTokenAddress { string } 目标链资产合约地址
   * @param params.amount { string } 目标链资产数量
   * @param params.fromAddress { string } 用户地址
   * @param params.slippage { number } 滑点
   * @param params.referrerAddress { string } 手续费收取地址
   * @returns {hash<string>}
   */
  async send1inchTransaction(params, address) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/swap',
        data: params,
        customUrl: `${inchBaseUrl}${this.nativeId}`
      });
      if (res.tx) {
        console.log(divisionDecimals(res.tx.value, res.fromToken.decimals).toString(), 'divisionDecimals(res.tx.value, res.fromToken.decimals).toString()')
        const txData = await this.setGasLimit({
          from: address,
          to: res.tx.to,
          data: res.tx.data,
          value: params.fromTokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? ethers.utils.parseEther(divisionDecimals(res.tx.value, res.fromToken.decimals || 18)).toHexString() : ethers.utils.hexlify(Number(res.tx.value))
        });
        const transfer = new ETransfer();
        return await transfer.sendTransaction(txData);
      }
    } catch (e) {
      console.log(e, 'error');
      if (e && e.message.indexOf('status code 400') !== -1) {
        return {
          msg: 'insufficient funds'
        };
      }
      return {
        msg: e.data && e.data.message || e.value && e.value.message || e.message || e
      };
    }
  }

  async setGasLimit(tx) {
    const transfer = new ETransfer();
    const gasLimit = await transfer.getGasLimit(tx);
    const tempTx = {
      ...tx,
      gasLimit
    };
    delete tempTx['from'];
    return tempTx;
  }
}
