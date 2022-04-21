import { currentNet, MAIN_INFO, NULS_INFO } from '@/config';
import { divisionAndFix, Minus, Plus, Times, timesDecimals, tofix } from '@/api/util';
import { crossFee, ETransfer, NTransfer } from '@/api/api';
import { post, request } from '@/network/http';

export const feeRate = 0.0002; // nerve链上兑换稳定币手续费万二

const nerve = require('nerve-sdk-js');
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default class NerveChannel {
  constructor({ chooseFromAsset, chooseToAsset, swapPairInfo, swapPairTradeList }) {
    const nerveSwapAssetList = JSON.parse(sessionStorage.getItem('nerveSwapAssetList'));
    const fromAssetKey = (chooseFromAsset && `${chooseFromAsset.chainId}-${chooseFromAsset.assetId}`) || '';
    const swapPairTradeInfo = swapPairTradeList && swapPairTradeList.find(item => Object.keys(item.groupCoin).indexOf(fromAssetKey) !== -1) || null;
    const lpToken = swapPairTradeInfo && swapPairTradeInfo.lpToken || null;
    this.originalFromAsset = chooseFromAsset || {};
    let tempFromAsset;
    if (swapPairTradeInfo && lpToken && chooseToAsset.chain === 'NERVE' && chooseFromAsset.chain === 'NERVE') {
      tempFromAsset = nerveSwapAssetList.find(item => `${item.chainId}-${item.assetId}` === lpToken);
    } else {
      tempFromAsset = chooseFromAsset;
    }
    this.chooseFromAsset = tempFromAsset;
    this.chooseToAsset = chooseToAsset;
    this.storeSwapPairInfo = {};
    swapPairInfo && this.getStoreSwapPairInfo(swapPairInfo);
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
    amount = timesDecimals(amount, fromDecimals);
    if (pairs.length) {
      const bestExact = type === 'amountIn' ? this.getBestTradeExactIn(amount, pairs) : this.getBestTradeExactOut(amount, pairs);
      if (bestExact) {
        const inAmount = bestExact.tokenAmountIn.amount.toString();
        const outAmount = bestExact.tokenAmountOut.amount.toString();
        const tokenPathArray = bestExact.path;
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
    console.log(this.chooseFromAsset, 'this.chooseFromAsset');
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
  getNerveChannelConfig(type, amount, swapPairTradeList) {
    const [swapAmount, priceImpact, routeSymbolList] = this.getSwapAmount(type, amount, swapPairTradeList);
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
  async sendNerveSwapTransaction(nerveChannel, nerveAddress, swapPairTradeList) {
    console.log(swapPairTradeList, 'swapPairTradeList');
    const fromAssetKey = `${this.originalFromAsset.chainId}-${this.originalFromAsset.assetId}`;
    const toAssetKey = `${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
    const swapPairTradeInfo = swapPairTradeList.find(item => Object.keys(item.groupCoin).indexOf(fromAssetKey) !== -1) || null;
    const lpToken = swapPairTradeInfo && swapPairTradeInfo.lpToken;
    const pairAddress = swapPairTradeInfo && swapPairTradeInfo.address;
    const fromAssetDecimals = this.originalFromAsset.decimals;
    const toAssetDecimals = this.chooseToAsset.decimals;
    const fromAddress = nerveAddress;
    const { amount, minReceive } = nerveChannel;
    const amountIn = amount;
    const swapAmountIn = timesDecimals(amountIn, fromAssetDecimals); // 卖出的资产数量
    const amountOutMin = timesDecimals(minReceive, toAssetDecimals).split('.')[0]; // 最小买进的资产数量
    const feeTo = null; // 交易手续费取出一部分给指定的接收地址
    const deadline = nerve.swap.currentTime() + 300; // 过期时间
    const toAddress = fromAddress; // 资产接收地址
    const remark = 'Swap...';
    if (lpToken && pairAddress) {
      const swapAmountIn = timesDecimals(amountIn, fromAssetDecimals); // 卖出的资产数量
      const tokenPath = [nerve.swap.token(this.originalFromAsset.chainId, this.originalFromAsset.assetId), nerve.swap.token(lpToken.split('-')[0], lpToken.split('-')[1]), nerve.swap.token(this.chooseToAsset.chainId, this.chooseToAsset.assetId)];
      const tx = await nerve.swap.stableLpSwapTrade(
        fromAddress,
        pairAddress,
        swapAmountIn,
        tokenPath,
        amountOutMin,
        feeTo,
        deadline,
        toAddress,
        remark
      );
      return nerve.deserializationTx(tx.hex);
    } else {
      // 币币交换资产路径，路径中最后一个资产，是用户要买进的资产
      const key = fromAssetKey + '_' + toAssetKey;
      // TODO:替换tempPairInfo
      // const pairsInfo = tempStorePairInfo[key];
      const pairsInfo = this.storeSwapPairInfo[key];
      const pairs = Object.values(pairsInfo);
      const bestExactIn = this.getBestTradeExactIn(swapAmountIn, pairs);
      const tokenPath = bestExactIn.path;
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
  }
  // 发送NERVE稳定币swap交易
  async sendNerveStableSwapTransaction(amount, fromAddress, tokenOutIndex) {
    const stablePairAddress = this.originalFromAsset.channelInfo['NERVE'].pairAddress;
    console.log(this.originalFromAsset, 'this.originalFromAsset');
    const amountIn = timesDecimals(amount || 0, this.originalFromAsset.decimals);
    const amountIns = [nerve.swap.tokenAmount(this.originalFromAsset.chainId, this.originalFromAsset.assetId, amountIn)];
    const feeTo = null;
    const deadline = nerve.swap.currentTime() + 300;
    const toAddress = fromAddress;
    const remark = 'stable swap trade remark...';
    const tx = await nerve.swap.stableSwapTrade(
      fromAddress,
      stablePairAddress,
      amountIns,
      tokenOutIndex,
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
    const transfer = new ETransfer();
    return await transfer.crossInII(params);
  }
  // 发送nerve通道nerve => 异构链稳定币兑换交易
  async sendNerveCommonTransaction(params) {
    const {
      currentChannel,
      currentAccount,
      swapNerveAddress,
      swapNulsAddress,
      fromAsset,
      toNetwork,
      chainId,
      assetId,
      signAddress,
      amountIn,
      fee,
      orderId,
      fromNetwork,
      NULSContractGas,
      NULSContractTxData
    } = params;
    const originCrossChainFee = currentChannel.originCrossChainFee || 0;
    let type = 2;
    let txData = {};
    let transferInfo = {
      from: currentAccount && currentAccount['address'][fromNetwork] || '',
      to: swapNerveAddress,
      amount: amountIn,
      fee: timesDecimals(fee, MAIN_INFO['decimal']),
      assetsChainId: chainId,
      assetsId: assetId
    };
    if (fromNetwork === 'NULS') {
      if (fromAsset.contractAddress) {
        type = 16;
        const price = 25;
        transferInfo = {
          from: currentAccount && currentAccount['address'][fromNetwork] || '',
          assetsChainId: NULS_INFO.chainId,
          assetsId: NULS_INFO.assetId,
          amount: Plus(10000000, Times(NULSContractGas, price)).toFixed(), // 计算input output函数里面再加上0.001
          toContractValue: 10000000,
          to: fromAsset.contractAddress,
          nulsValueToOthers: [{ // 往nuls中转地址转的nuls数量
            value: timesDecimals(originCrossChainFee, 8),
            address: swapNulsAddress
          }]
        };
        console.log(originCrossChainFee.toString(), '1231231');
        if (originCrossChainFee == 0) {
          delete transferInfo['nulsValueToOthers'];
        }
        txData = NULSContractTxData;
      } else {
        // 只做普通转账交易、将手续费和转账资产转到nuls中转地址
        transferInfo.to = swapNulsAddress;
        transferInfo.fee = timesDecimals(0.001, 8);
      }
    }
    const transfer = new NTransfer({
      chain: fromNetwork,
      type
    });
    let inputsOutputs = await transfer.inputsOrOutputs(transferInfo);
    if (fromNetwork === 'NERVE') {
      const data = {
        inputOutputs: inputsOutputs,
        from: currentAccount && currentAccount['address'][fromNetwork] || '',
        to: swapNerveAddress,
        originCrossChainFee,
        fromAsset,
        currentAccount,
        toNetwork
      };
      inputsOutputs = await this.handleNerveCross(data);
    }
    if (fromNetwork === 'NULS' && !fromAsset.contractAddress) {
      const data = {
        inputOutputs: inputsOutputs,
        from: currentAccount && currentAccount['address'][fromNetwork] || '',
        to: swapNulsAddress,
        originCrossChainFee,
        fromAsset,
        currentAccount,
        toNetwork
      };
      inputsOutputs = await this.handleNulsCross(data);
    }
    const txHex = await transfer.getTxHex({
      inputs: inputsOutputs.inputs,
      outputs: inputsOutputs.outputs,
      txData,
      pub: currentAccount.pub,
      signAddress,
      remarks: orderId || ''
    });
    return await this.broadcastHex(txHex, fromNetwork);
  }
  // 将手续费转到nerve中转地址
  async handleNerveCross(data) {
    const { inputOutputs, from, to, originCrossChainFee, fromAsset, toNetwork, currentAccount } = data;
    const { inputs, outputs } = inputOutputs;
    const { nerveChainId: assetsChainId, nerveAssetId: assetsId } = fromAsset;
    const { chainId: NerveChainId, assetId: NerveAssetId } = MAIN_INFO;
    const { chainId: NulsChainId, assetId: NulsAssetId } = NULS_INFO;
    const NVTNonce = await this.getNonce({ chain: 'NERVE', chainId: NerveChainId, assetId: NerveAssetId, currentAccount });
    if (toNetwork === 'NULS') {
      const feeAmount = timesDecimals(crossFee, 8);
      const NULSNonce = await this.getNonce({ chain: 'NERVE', chainId: NulsChainId, assetId: NulsAssetId, currentAccount });
      if (assetsChainId === NerveChainId && assetsId === NerveAssetId) {
        const newNvtAmount = Plus(inputs[0].amount, feeAmount).toFixed();
        inputs[0].amount = newNvtAmount;
        outputs[0].amount = newNvtAmount;
        inputs.push({
          address: from,
          assetsChainId: NulsChainId,
          assetsId: NulsAssetId,
          amount: feeAmount,
          locked: 0,
          nonce: NULSNonce
        });
        outputs.push({
          address: to,
          assetsChainId: NulsChainId,
          assetsId: NulsAssetId,
          amount: feeAmount,
          lockTime: 0
        });
      } else if (assetsChainId === NulsChainId && assetsId === NulsAssetId) {
        const newNulsAmount = Plus(inputs[0].amount, feeAmount).toFixed();
        inputs[0].amount = newNulsAmount;
        outputs[0].amount = newNulsAmount;
        inputs.push({
          address: from,
          assetsChainId: NerveChainId,
          assetsId: NerveAssetId,
          amount: feeAmount,
          locked: 0,
          nonce: NVTNonce
        });
        outputs.push({
          address: to,
          assetsChainId: NerveChainId,
          assetsId: NerveAssetId,
          amount: feeAmount,
          lockTime: 0
        });
      } else {
        inputs.push({
          address: from,
          assetsChainId: NerveChainId,
          assetsId: NerveAssetId,
          amount: feeAmount,
          locked: 0,
          nonce: NVTNonce
        },
        {
          address: from,
          assetsChainId: NulsChainId,
          assetsId: NulsAssetId,
          amount: feeAmount,
          locked: 0,
          nonce: NULSNonce
        });
        outputs.push({
          address: to,
          assetsChainId: NerveChainId,
          assetsId: NerveAssetId,
          amount: feeAmount,
          lockTime: 0
        },
        {
          address: to,
          assetsChainId: NulsChainId,
          assetsId: NulsAssetId,
          amount: feeAmount,
          lockTime: 0
        });
      }
    } else {
      console.log(inputs, outputs, 'inputs, outputs');
      console.log(originCrossChainFee.toString(), inputs, outputs, 'crossOutFeecrossOutFeecrossOutFee');
      const feeAmount = timesDecimals(originCrossChainFee, 8);
      if (assetsChainId === NerveChainId && assetsId === NerveAssetId) {
        const newNvtAmount = Plus(inputs[0].amount, feeAmount).toFixed();
        inputs[0].amount = newNvtAmount;
        outputs[0].amount = newNvtAmount;
      } else {
        inputs.push({
          address: from,
          assetsChainId: NerveChainId,
          assetsId: NerveAssetId,
          amount: feeAmount,
          locked: 0,
          nonce: NVTNonce
        });
        outputs.push({
          address: to,
          assetsChainId: NerveChainId,
          assetsId: NerveAssetId,
          amount: feeAmount,
          lockTime: 0
        });
      }
    }
    console.log(inputs, outputs);
    return { inputs, outputs };
  }
  // 特殊处理nuls跨链, 合约资产前面已经处理了， 转到nerve中转地址
  async handleNulsCross(data) {
    const { inputs, outputs, to, originCrossChainFee, fromAsset } = data;
    const { nerveChainId: assetsChainId, nerveAssetId: assetsId } = fromAsset;
    const { chainId: NulsChainId, assetId: NulsAssetId } = NULS_INFO;
    const fee = Plus(crossFee, originCrossChainFee || 0).toFixed();
    const feeAmount = timesDecimals(fee, 8);
    if (assetsChainId === NulsChainId && assetsId === NulsAssetId) {
      const amount = inputs[0].amount;
      const txSizeFee = timesDecimals(0.001, 8);
      inputs[0].amount = Plus(amount, feeAmount).toFixed();
      outputs[0].amount = Minus(inputs[0].amount, txSizeFee).toFixed();
    } else {
      inputs.forEach(input => {
        if (input.assetsChainId === NulsChainId && input.assetsId === NulsAssetId) {
          const amount = input.amount;
          input.amount = Plus(amount, feeAmount).toFixed();
        }
      });
      outputs.push({
        address: to,
        assetsChainId: NulsChainId,
        assetsId: NulsAssetId,
        amount: feeAmount,
        lockTime: 0
      });
    }
    return { inputs, outputs };
  }
  // 获取nonce值
  async getNonce(assetInfo) {
    const { chainId, assetId, contractAddress, chain, currentAccount } = assetInfo;
    const tempParams = [{
      chainId,
      assetId,
      contractAddress
    }];
    const params = [chain === 'NULS' ? NULS_INFO.chainId : MAIN_INFO.chainId, currentAccount['address'][chain], tempParams];
    const url = chain === 'NULS' ? NULS_INFO.batchRPC : MAIN_INFO.batchRPC;
    const res = await post(url, 'getBalanceList', params);
    if (res.result && res.result.length !== 0) {
      const tempAssetInfo = res.result[0];
      return tempAssetInfo.nonce;
    } else {
      return null;
    }
  }
  // 广播nerve交易
  async broadcastHex(txHex, chain) {
    const config = JSON.parse(sessionStorage.getItem('config'));
    const url = config[chain].apiUrl;
    const chainId = config[chain].chainId;
    console.log(txHex, '---NERVE swap txHex---');
    const res = await post(url, 'broadcastTx', [chainId, txHex]);
    if (res.result && res.result.hash) {
      return { hash: res.result.hash, success: true };
    }
    return { hash: null, msg: `${res.error.code}:${res.error.data}` || res.error.data };
  }
}
