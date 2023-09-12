import {sendRequest} from '@/network/cancelRequest';
import {Division, divisionDecimals, Minus} from '@/api/util';
import {ethers} from "ethers";
import {ETransfer} from "@/api/api";

const OKXBaseUrl = 'https://www.okx.com';

export default class OKXChannel {
  static async getOKXChannelQuote(params, toTokenDecimals) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/api/v5/dex/aggregator/quote',
        data: params,
        customUrl: OKXBaseUrl,
        isOKX: true
      });
      if (res && res.data && res.data.length) {
        const toTokenAmount = divisionDecimals(res.data[0].toTokenAmount, toTokenDecimals || 18);
        return {
          toAmount: Minus(toTokenAmount, Division(toTokenAmount, 1000))
        };
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  static async getOKXAssetAllowance(params, baseAllowance) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/api/v5/dex/aggregator/get-allowance',
        data: params,
        customUrl: OKXBaseUrl,
        isOKX: true
      });
      console.log(baseAllowance, '==baseAllowance==');
      // const baseAllowance = '10';
      if (res && res.data && res.data.length) {
        return Minus(res.data[0].allowanceAmount, baseAllowance) < 0;
      }
      return true;
    } catch (e) {
      return true;
    }
  }
  async getOKXApproveTransactionData(params, userAddress) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/api/v5/dex/aggregator/approve-transaction',
        data: params,
        customUrl: OKXBaseUrl,
        isOKX: true
      });
      if (res && res.data && res.data.length) {
        const tx = res.data[0];
        return await this.setGasLimit({
          from: userAddress,
          to: params.tokenContractAddress,
          data: tx.data,
          value: '0x00'
        });
      }
    } catch (e) {
      console.error(e, 'error');
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
  async sendOKXTransaction(params, fromAsset) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/api/v5/dex/aggregator/swap',
        data: params,
        customUrl: OKXBaseUrl,
        isOKX: true
      });
      if (res.code === '0' && res.data.length) {
        const tx = res.data[0].tx;
        const txData = await this.setGasLimit({
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: ethers.utils.parseEther(divisionDecimals(tx.value, fromAsset && fromAsset.decimals || 18)).toHexString()
        });
        const transfer = new ETransfer();
        return await transfer.sendTransaction(txData);
      }
    } catch (e) {
      console.error(e, 'error');
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
}
