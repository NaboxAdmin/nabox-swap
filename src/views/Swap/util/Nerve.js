import { currentNet, MAIN_INFO, NULS_INFO } from '@/config';
import { tempStorePairInfo } from './tempData';
import { tempAssetList } from './tempData';
import { divisionAndFix, tofix, timesDecimals } from '@/api/util';
import { ETransfer } from '@/api/api';
import { request, post } from '@/network/http';
import { NTransfer } from '@/api/api';

export const feeRate = 0.0002; // nerve链上兑换稳定币手续费万二

const nerve = require('nerve-sdk-js');
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default class NerveChannel {
  constructor({ chooseFromAsset, chooseToAsset, swapPairInfo }) {
    this.chooseFromAsset = chooseFromAsset;
    this.chooseToAsset = chooseToAsset;
    // this.chooseFromAsset = MAIN_INFO;
    // this.chooseToAsset = NULS_INFO;
    this.storeSwapPairInfo = {};
    this.getStoreSwapPairInfo(swapPairInfo);
  }
  // 计算兑换的数量
  getSwapAmount(type, amount) {
    const assetKey = this.generateAssetKey();
    // const tempPairInfo = tempStorePairInfo[assetKey];
    const tempPairInfo = this.storeSwapPairInfo[assetKey];
    const pairs = Object.values(tempPairInfo);
    console.log(pairs, '==pairs==');
    const nerveSwapAssetList = JSON.parse(sessionStorage.getItem('nerveSwapAssetList'));
    console.log(nerveSwapAssetList, 'nerveSwapAssetListnerveSwapAssetList');
    const fromDecimals = type === 'amountIn' ? this.chooseFromAsset.decimals : this.chooseToAsset.decimals;
    const toDecimals = type === 'amountIn' ? this.chooseToAsset.decimals : this.chooseFromAsset.decimals;
    console.log(fromDecimals, '123 fromDecimalsfromDecimals fromDecimals')
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
          const asset = nerveSwapAssetList.find(asset => `${item.chainId}-${item.assetId}` === `${asset.chainId}-${asset.assetId}`);
          return asset && asset.symbol;
        });
        const pairsArray = tokenPathArray.map((token, index, array) => {
          const token0 = array[index];
          const token1 = array[index + 1];
          // console.log(array, '======array');
          const key = `${token0 && token0.chainId}-${token0 && token0.assetId}_${token1 && token1.chainId}-${token1 && token1.assetId}`;
          const reverseKey = `${token1 && token1.chainId}-${token1 && token1.assetId}_${token0 && token0.chainId}-${token0 && token0.assetId}`;
          console.log(key, 'keyyyyyyyyyyyyyyyyyyy');
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
  // 获取交易对信息
  getStoreSwapPairInfo(swapPairInfo) {
    const pairsInfo = {};
    const fromAssetKey = `${this.chooseFromAsset.chainId}-${this.chooseFromAsset.assetId}`;
    const toAssetKey = `${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
    const key = fromAssetKey + '_' + toAssetKey;
    if (swapPairInfo && swapPairInfo.length) {
      for (let i = 0; i < swapPairInfo.length; i++) {
        const token0 = swapPairInfo[i].token0;
        const token1 = swapPairInfo[i].token1;
        pairsInfo[
          `${token0.chainId}-${token0.assetId}_${token1.chainId}-${token1.assetId}`
        ] = nerve.swap.pair(
          {
            chainId: token0.chainId,
            assetId: token0.assetId
          },
          {
            chainId: token1.chainId,
            assetId: token1.assetId
          },
          swapPairInfo[i].token0.amount,
          swapPairInfo[i].token1.amount
        );
      }
    }
    this.storeSwapPairInfo[key] = pairsInfo;
    console.log(this.storeSwapPairInfo, '12312321');
  }
  // 获取nerve链上兑换的配置
  getNerveChannelConfig(type, amount) {
    const [swapAmount, priceImpact, routeSymbolList] = this.getSwapAmount(type, amount);
    console.log(swapAmount, priceImpact, routeSymbolList, type, 'swapAmount, priceImpact, routeSymbolList');
    if (swapAmount != 0) {
      return {
        amountIn: type === 'amountIn' ? amount : swapAmount,
        amountOut: type === 'amountOut' ? amount : swapAmount,
        priceImpact: tofix(timesDecimals(priceImpact, 2), 2, -1),
        routeSymbolList
      };
    }
    return null;
  }
  // 通过amountIn获取最佳路由
  getBestTradeExactIn(amount, pairs) {
    console.log(amount, pairs, '12312312312321');
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
      // console.log(res.tokenAmountIn.amount.toString(), 'getBestTradeExactIn');
      console.log(res, 'getBestTradeExactIn');
      return res;
    }
    return null;
  }
  // 通过amountOut获取最佳路由
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
    if (res.tokenAmountIn.amount.toString() && Object.values(res).length) {
      console.log(res.tokenAmountIn.amount.toString(), 'getBestTradeExactOut');
      return {
        path: res.path,
        tokenAmountIn: res.tokenAmountOut,
        tokenAmountOut: res.tokenAmountIn
      };
    }
    return null;
  }
  // 发送nerve链上兑换交易
  async sendNerveSwapTransaction(nerveChannel, nerveAddress) {
    console.log(nerveChannel, 'nerveChannelnerveChannelnerveChannel');
    const { amount, minReceive } = nerveChannel;
    const amountIn = amount;
    const fromAssetKey = `${this.chooseFromAsset.chainId}-${this.chooseFromAsset.assetId}`;
    const toAssetKey = `${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
    const fromAssetDecimals = this.chooseFromAsset.decimals;
    const toAssetDecimals = this.chooseToAsset.decimals;
    const fromAddress = nerveAddress;
    const swapAmountIn = timesDecimals(amountIn, fromAssetDecimals); // 卖出的资产数量
    // 币币交换资产路径，路径中最后一个资产，是用户要买进的资产
    const key = fromAssetKey + '_' + toAssetKey;
    // TODO:替换tempPairInfo
    // const pairsInfo = tempStorePairInfo[key];
    const pairsInfo = this.storeSwapPairInfo[key];
    const pairs = Object.values(pairsInfo);
    console.log(amountIn, fromAddress, 'amountIn');
    const bestExactIn = this.getBestTradeExactIn(swapAmountIn, pairs);
    console.log(bestExactIn, 'bestExactInbestExactInbestExactIn');
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
    return nerve.deserializationTx(tx.hex);
  }
  // 获取资产的key
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
  // 发送nerve通道异构链稳定币兑换交易
  async sendNerveBridgeTransaction(params) {
    const transfer = new ETransfer({
      chain: this.chooseFromAsset.chain
    });
    return await transfer.crossInII(params);
  }
  // 发送nerve通道nerve => 异构链稳定币兑换交易
  async sendNerveCommonTransaction(params) {
    const transfer = new NTransfer({
      chain: 'NERVE',
      type: 2
    });
    const { currentAccount, crossAddress, chainId, assetId, signAddress, amountIn, fee, orderId } = params;
    const transferInfo = {
      from: currentAccount && currentAccount.address['NERVE'] || '',
      to: crossAddress,
      amount: amountIn,
      fee: timesDecimals(fee, MAIN_INFO['decimal']),
      assetsChainId: chainId,
      assetsId: assetId
    };
    const { inputs, outputs } = await transfer.transferTransaction(transferInfo);
    const txHex = await transfer.getTxHex({
      inputs,
      outputs,
      txData: {},
      pub: currentAccount.pub,
      signAddress,
      remarks: orderId || ''
    });
    return await this.broadcastHex(txHex);
  }
  // 广播nerve交易
  async broadcastHex(txHex) {
    const config = JSON.parse(sessionStorage.getItem('config'));
    const url = config['NERVE'].apiUrl;
    const chainId = config['NERVE'].chainId;
    console.log(txHex, '---NERVE swap txHex---');
    const res = await post(url, 'broadcastTx', [chainId, txHex]);
    if (res.result && res.result.hash) {
      return { hash: res.result.hash, success: true };
    }
    return { hash: null, msg: res.error.msg || res.error.data };
  }
}
