import { sendRequest } from '@/network/cancelRequest';
import { ETransfer } from '@/api/api';
import { ethers } from 'ethers';

const dodoBaseUrl = 'https://route-api.dodoex.io/dodoapi'; // https://route-api.dodoex.io/dodoapi(主网)
const dodoTestBaseUrl = 'https://test-route-api.dodoex.io/dodoapi';

export default class Dodo {
  constructor() {
    this.transfer = new ETransfer();
  }
  async getDodoRoute(params) {
    try {
      const res = await sendRequest({
        method: 'get',
        url: '/getdodoroute',
        data: params,
        customUrl: (params.chainId == 1 || params.chainId == 56 || params.chainId == 137) && dodoTestBaseUrl || dodoBaseUrl
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
