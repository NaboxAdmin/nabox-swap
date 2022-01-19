import { currentNet, MAIN_INFO, NULS_INFO } from '@/config';
import { tempPairInfo } from './tempData';
import { tempAssetList } from './tempData';
import { divisionAndFix, tofix, timesDecimals } from '@/api/util';
import { ETransfer } from '@/api/api';
import { request, post } from '@/network/http';
import { NTransfer } from '@/api/api';

const nerve = require('nerve-sdk-js');
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default class NerveChannel {
  constructor({ chooseFromAsset, chooseToAsset, swapPairInfo }) {
    // this.chooseFromAsset = chooseFromAsset;
    // this.chooseToAsset = chooseToAsset;
    this.chooseFromAsset = MAIN_INFO;
    this.chooseToAsset = NULS_INFO;
  }
  getSwapAmount(type, amount) {
    const assetKey = this.generateAssetKey();
    const pairs = Object.values(tempPairInfo);
    console.log(pairs, '==pairs==');
    // TODO: 还需要修改 decimal => decimals
    const fromDecimals = type === 'amountIn' ? this.chooseFromAsset.decimal : this.chooseToAsset.decimal;
    const toDecimals = type === 'amountIn' ? this.chooseToAsset.decimal : this.chooseFromAsset.decimal;
    amount = timesDecimals(amount, fromDecimals);
    if (pairs.length) {
      const bestExact = type === 'amountIn' ? this.getBestTradeExactIn(amount, pairs) : this.getBestTradeExactOut(amount, pairs);
      if (bestExact) {
        // console.log(bestExact);
        const inAmount = bestExact.tokenAmountIn.amount.toString();
        const outAmount = bestExact.tokenAmountOut.amount.toString();
        const tokenPathArray = bestExact.path;
        // console.log(inAmount, outAmount, 'inAmount outAmount');
        const routeSymbolList = tokenPathArray.map(item => {
          const asset = tempAssetList.find(asset => `${item.chainId}-${item.assetId}` === `${asset.chainId}-${asset.assetId}`);
          return asset && asset.symbol;
        });
        const pairsArray = tokenPathArray.map((token, index, array) => {
          const token0 = array[index];
          const token1 = array[index + 1];
          // console.log(array, '======array');
          const key = `${token0 && token0.chainId}-${token0 && token0.assetId}_${token1 && token1.chainId}-${token1 && token1.assetId}`;
          const reverseKey = `${token1 && token1.chainId}-${token1 && token1.assetId}_${token0 && token0.chainId}-${token0 && token0.assetId}`;
          if (tempPairInfo[key]) {
            return tempPairInfo[key];
          } else if (tempPairInfo[reverseKey]) {
            return tempPairInfo[reverseKey];
          }
        }).filter(item => item);
        // console.log(pairsArray, '==pairsArray==');
        const fromAmount = type === 'amountIn' ? inAmount : outAmount;
        const toAmount = type === 'amountIn' ? outAmount : inAmount;
        const priceImpact = nerve.swap.getPriceImpact(
          [fromAmount, toAmount],
          tokenPathArray,
          pairsArray
        );
        return [
          divisionAndFix(outAmount, toDecimals, toDecimals),
          priceImpact,
          routeSymbolList
        ];
      }
    } else {
      return [0, 0, []];
    }
  }

  getNerveChannelConfig(type, amount) {
    const [swapAmount, priceImpact, routeSymbolList] = this.getSwapAmount(type, amount);
    console.log(swapAmount, tofix(timesDecimals(priceImpact, 2), 2, -1), routeSymbolList, 'swapAmount, priceImpact, routeSymbolList');
    if (swapAmount !== 0) {
      return {
        amountIn: type === 'amountIn' && amount || swapAmount,
        amountOut: type === 'amountOut' && swapAmount || amount,
        priceImpact: tofix(timesDecimals(priceImpact, 2), 2, -1),
        routeSymbolList
      };
    }
    return null;
  }

  getBestTradeExactIn(amount, pairs) {
    const tokenAmountIn = nerve.swap.tokenAmount(
      this.chooseFromAsset.chainId,
      this.chooseFromAsset.assetId,
      amount
    );
    const tokenOut = nerve.swap.token(
      this.chooseToAsset.chainId,
      this.chooseToAsset.assetId
    );
    const maxPairSize = 3;
    const res = nerve.swap.bestTradeExactIn(
      MAIN_INFO.chainId,
      pairs,
      tokenAmountIn,
      tokenOut,
      maxPairSize
    );
    if (res && Object.values(res).length) {
      console.log(res, 'getBestTradeExactIn');
      return res;
    }
    return null;
  }

  getBestTradeExactOut(amount, pairs) {
    const tokenIn = nerve.swap.token(
      this.chooseFromAsset.chainId,
      this.chooseFromAsset.assetId
    );
    const tokenAmountOut = nerve.swap.tokenAmount(
      this.chooseToAsset.chainId,
      this.chooseToAsset.assetId,
      amount
    );
    const maxPairSize = 3;
    const res = nerve.swap.bestTradeExactOut(
      MAIN_INFO.chainId,
      pairs,
      tokenIn,
      tokenAmountOut,
      maxPairSize
    );
    if (res && Object.values(res).length) {
      console.log(res, 'getBestTradeExactOut');
      return {
        path: res.path,
        tokenAmountIn: res.tokenAmountOut,
        tokenAmountOut: res.tokenAmountIn
      };
    }
    return null;
  }

  async sendNerveSwapTransaction(nerveChannel, nerveAddress) {
    const { amountIn, minReceive } = nerveChannel;
    const fromAssetKey = `${this.chooseFromAsset.chainId}-${this.chooseFromAsset.assetId}`;
    const toAssetKey = `${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
    const fromAssetDecimals = this.chooseFromAsset.decimals;
    const toAssetDecimals = this.chooseToAsset.decimals;

    const fromAddress = nerveAddress;
    const swapAmountIn = timesDecimals(amountIn, fromAssetDecimals); // 卖出的资产数量
    // 币币交换资产路径，路径中最后一个资产，是用户要买进的资产
    const key = fromAssetKey + '_' + toAssetKey;
    // TODO:替换tempPairInfo
    const pairsInfo = tempPairInfo[key];
    const pairs = Object.values(pairsInfo);
    const bestExactIn = this.getBestTradeExactIn(amountIn, pairs);
    const tokenPath = bestExactIn.path;
    const amountOutMin = timesDecimals(minReceive, toAssetDecimals).split('.')[0]; // 最小买进的资产数量
    const feeTo = null; // 交易手续费取出一部分给指定的接收地址
    const deadline = nerve.swap.currentTime() + 300; // 过期时间
    const toAddress = fromAddress; // 资产接收地址
    const remark = 'Swap...';
    const tx = await nerve.swap.swapTrade(
      fromAddress,
      swapAmountIn,
      tokenPath,
      amountOutMin,
      feeTo,
      deadline,
      toAddress,
      remark
    );
    return tx.hash;
  }

  generateAssetKey() {
    return `${this.chooseFromAsset.chainId}-${this.chooseFromAsset.assetId}_${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
  }
  // 获取Nerve预估费率信息
  async getNerveEstimateFeeInfo(params) {
    const res = await request({
      url: '/swap/nerve/channel/fee',
      data: params
    });
    if (res.code === 1000) {
      return {
        crossChainFee: res.data.crossFee,
        swapFee: res.data.swapFee,
        orderId: res.data.orderId
      };
    }
    return null;
  }
  // 发送nerve稳定币交易
  async sendNerveBridgeTransaction(params) {
    const transfer = new ETransfer({
      chain: this.chooseFromAsset.chain
    });
    return await transfer.crossInII(params);
  }
  // 发送普通nerve转账交易
  async sendNerveCommonTransaction(params) {
    const transfer = new NTransfer({
      chain: 'NERVE',
      type: 2
    });
    const { currentAccount, crossAddress, chainId, assetId, signAddress, amountIn } = params;
    const transferInfo = {
      from: currentAccount && currentAccount.address['NERVE'] || '',
      to: crossAddress,
      amount: amountIn,
      fee: 0,
      assetsChainId: chainId,
      assetsId: assetId
    };
    const { inputs, outputs } = await transfer.transferTransaction(transferInfo);
    const txHex = await transfer.getTxHex({
      inputs,
      outputs,
      txData: {},
      pub: currentAccount.pub,
      signAddress
    });
    return await this.broadcastHex(txHex);
  }
  async broadcastHex(txHex) {
    const config = JSON.parse(sessionStorage.getItem('config'));
    const url = config['NERVE'].apiUrl;
    const chainId = config['NERVE'].chainId;
    console.log(txHex, '---NERVE swap txHex---');
    const res = await post(url, 'broadcastTx', [chainId, txHex]);
    if (res.result && res.result.hash) {
      return { hash: res.result.hash, success: true };
    }
    return null;
  }
}
