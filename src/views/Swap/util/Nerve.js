import { currentNet, MAIN_INFO, NULS_INFO } from '@/config';
import { tempPairInfo } from './tempData';
import { timesDecimals } from '@/api/util';
import { tempAssetList } from './tempData';
import { divisionAndFix, tofix } from '../../../api/util';

const nerve = require('nerve-sdk-js');
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default class NerveChannel {
  constructor({ chooseFromAsset, chooseToAsset }) {
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
    console.log(fromDecimals, 'fromDecimals');
    amount = timesDecimals(amount, fromDecimals);
    if (pairs.length) {
      const bestExact = type === 'amountIn' ? this.getBestTradeExactIn(amount, pairs) : this.getBestTradeExactOut(amount, pairs);
      if (bestExact) {
        console.log(bestExact);
        const inAmount = bestExact.tokenAmountIn.amount.toString();
        const outAmount = bestExact.tokenAmountOut.amount.toString();
        const tokenPathArray = bestExact.path;
        console.log(inAmount, outAmount, 'inAmount outAmount');
        const routeSymbolList = tokenPathArray.map(item => {
          const asset = tempAssetList.find(asset => `${item.chainId}-${item.assetId}` === `${asset.chainId}-${asset.assetId}`);
          return asset && asset.symbol;
        });
        const pairsArray = tokenPathArray.map((token, index, array) => {
          const token0 = array[index];
          const token1 = array[index + 1];
          console.log(array, '======array');
          const key = `${token0 && token0.chainId}-${token0 && token0.assetId}_${token1 && token1.chainId}-${token1 && token1.assetId}`;
          const reverseKey = `${token1 && token1.chainId}-${token1 && token1.assetId}_${token0 && token0.chainId}-${token0 && token0.assetId}`;
          if (tempPairInfo[key]) {
            return tempPairInfo[key];
          } else if (tempPairInfo[reverseKey]) {
            return tempPairInfo[reverseKey];
          }
        }).filter(item => item);
        console.log(pairsArray, '==pairsArray==');
        console.log(routeSymbolList, 'routeSymbolList');
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

  async sendNerveSwapTransaction(hex) {
    const fromAssetKey = `${this.chooseFromAsset.chainId}-${this.chooseFromAsset.assetId}`;
    const toAssetKey = `${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
    const fromAssetDecimals = this.chooseFromAsset.decimals;
    const toAssetDecimals = this.chooseToAsset.decimals;
  }

  generateAssetKey() {
    return `${this.chooseFromAsset.chainId}-${this.chooseFromAsset.assetId}_${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
  }
}
