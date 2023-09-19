import { sendRequest } from '@/network/cancelRequest';
import { ETransfer } from '@/api/api';
import { ethers } from 'ethers';
import { Division } from '@/api/util';

export const apiKey = '8477c6932c9df6c5b8';
const dodoBaseUrl = 'https://api.dodoex.io'; // https://route-api.dodoex.io/dodoapi(主网)
const dodoTestBaseUrl = 'https://test-route-api.dodoex.io/dodoapi';

export default class Dodo {
  constructor() {
    this.transfer = new ETransfer();
  }
  async getDodoRoute(params) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/route-service/fee-route-widget/getdodoroute',
        data: params,
        customUrl: dodoBaseUrl,
        isDODO: true
      });
      if (res.status === 200) {
        return res.data;
      }
      return null;
    } catch (e) {
      console.error(e, 'error');
    }
  }

  async sendDodoTransaction(orderInfo) {
    const { fromAsset, amountIn, currentChannel, address: from } = orderInfo;
    const tempAmountIn = fromAsset.contractAddress ? '0' : amountIn;
    const amount = ethers.utils.parseEther(tempAmountIn).toHexString();
    const transactionParameters = await this.setGasLimit({
      from,
      to: currentChannel.transactionToAddress,
      value: amount,
      data: currentChannel.transactionData
    });
    return await this.transfer.sendTransaction(transactionParameters);
  }

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
