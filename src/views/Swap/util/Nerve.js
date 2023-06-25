import { currentNet, MAIN_INFO, NULS_INFO } from '@/config';
import { divisionAndFix, Minus, Plus, Times, timesDecimals, tofix, TRON } from '@/api/util';
import { crossFee, ETransfer, NTransfer } from '@/api/api';
import { post, request } from '@/network/http';
import TronLink from '@/api/tronLink';
import { ethers } from 'ethers';
import { withDrawAbi } from '@/api/contractConfig';

export const feeRate = 0.0002; // nerve链上兑换稳定币手续费万二

const nerve = require('nerve-sdk-js');
currentNet === 'mainnet' ? nerve.mainnet() : nerve.testnet();

export default class NerveChannel {
  constructor({ chooseFromAsset, chooseToAsset, swapPairInfo, swapPairTradeList, tokenPath, isFromMultiChainRouter, isToMultiChainRouter }) {
    console.log(chooseFromAsset, chooseToAsset, 'chooseFromAsset, chooseToAsset');
    const nerveSwapAssetList = JSON.parse(sessionStorage.getItem('nerveSwapAssetList'));
    const fromAssetKey = (chooseFromAsset && `${chooseFromAsset.chainId}-${chooseFromAsset.assetId}`) || '';
    const swapPairTradeInfo = swapPairTradeList && swapPairTradeList.find(item => Object.keys(item.groupCoin).indexOf(fromAssetKey) !== -1) || null;
    const lpToken = swapPairTradeInfo && swapPairTradeInfo.lpToken || null;
    this.originalFromAsset = chooseFromAsset || {};
    this.originalToAsset = chooseToAsset || {};
    let tempFromAsset, tempToAsset;
    this.checkFromAsset = isFromMultiChainRouter && chooseFromAsset && nerve.swap.checkStableToken(nerve.swap.token(chooseFromAsset.chainId, chooseFromAsset.assetId), swapPairTradeList || []) || {};
    this.checkToAsset = isToMultiChainRouter && chooseToAsset && nerve.swap.checkStableToken(nerve.swap.token(chooseToAsset.chainId, chooseToAsset.assetId), swapPairTradeList || []) || {};
    if (this.checkFromAsset.success) {
      this.isFromAssetStable = true; // usdt->nvt
      tempFromAsset = nerveSwapAssetList.find(item => `${item.chainId}-${item.assetId}` === `${this.checkFromAsset.lpToken.chainId}-${this.checkFromAsset.lpToken.assetId}`);
    } else {
      this.isFromAssetStable = false;
      tempFromAsset = chooseFromAsset;
    }
    if (this.checkToAsset.success) {
      this.isToAssetStable = true;// nvt->usdt
      tempToAsset = nerveSwapAssetList.find(item => `${item.chainId}-${item.assetId}` === `${this.checkToAsset.lpToken.chainId}-${this.checkToAsset.lpToken.assetId}`);
    } else {
      this.isToAssetStable = false;
      tempToAsset = chooseToAsset;
    }
    console.log(this.checkToAsset, 'tempToAsset');
    this.chooseFromAsset = tempFromAsset;
    this.chooseToAsset = tempToAsset;
    this.storeSwapPairInfo = {};
    this.tokenPath = tokenPath || [];
    console.log(swapPairInfo, 'swapPairInfo');
    swapPairInfo && this.getStoreSwapPairInfo(swapPairInfo);
  }
  // 计算兑换的数量
  getSwapAmount(type, amount) {
    const assetKey = this.generateAssetKey();
    // const tempPairInfo = tempStorePairInfo[assetKey];
    const tempPairInfo = this.storeSwapPairInfo[assetKey];
    console.log(tempPairInfo, 'tempPairInfo')
    const pairs = Object.values(tempPairInfo);
    const nerveSwapAssetList = JSON.parse(sessionStorage.getItem('nerveSwapAssetList'));
    const fromDecimals = type === 'amountIn' ? this.chooseFromAsset.decimals : this.chooseToAsset.decimals;
    const toDecimals = type === 'amountIn' ? this.chooseToAsset.decimals : this.chooseFromAsset.decimals;
    amount = timesDecimals(amount, fromDecimals);
    if (pairs.length) {
      const bestExact = type === 'amountIn' ? this.getBestTradeExactIn(amount, pairs) : this.getBestTradeExactOut(amount, pairs);
      if (bestExact) {
        const inAmount = bestExact.tokenAmountIn.amount.toString();
        const outAmount = bestExact.tokenAmountOut.amount.toString();
        const tokenPathArray = bestExact.path;
        this.tokenPath = bestExact.path;
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
          routeSymbolList,
          tokenPathArray
        ];
      } else {
        return [0, 0, [], []];
      }
    } else {
      return [0, 0, [], []];
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
        ] = nerve.swap.pair({
          chainId: token0.chainId,
          assetId: token0.assetId
        }, {
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
    const [swapAmount, priceImpact, routeSymbolList, tokenPath] = this.getSwapAmount(type, amount, swapPairTradeList);
    if (swapAmount != 0) {
      return {
        amountIn: type === 'amountIn' ? amount : swapAmount,
        amountOut: type === 'amountOut' ? amount : swapAmount,
        priceImpact: tofix(timesDecimals(priceImpact, 2), 2, -1),
        routeSymbolList,
        tokenPath
      };
    }
    return null;
  }
  // 通过amountIn获取最佳路由
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
      // console.log(res.tokenAmountIn.amount.toString(), 'getBestTradeExactIn');
      // console.log(res, 'getBestTradeExactIn');
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
    console.log('==sendNerveSwapTransaction==');
    const fromAssetKey = `${this.originalFromAsset.chainId}-${this.originalFromAsset.assetId}`;
    const toAssetKey = `${this.chooseToAsset.chainId}-${this.chooseToAsset.assetId}`;
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
    if (this.isFromAssetStable) {
      const pairAddress = this.checkFromAsset.address;
      const swapAmountIn = timesDecimals(amountIn, fromAssetDecimals); // 卖出的资产数量
      const tokenPath = [nerve.swap.token(this.originalFromAsset.chainId, this.originalFromAsset.assetId), ...this.tokenPath];
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
    } else if (this.isToAssetStable) {
      const swapAmountIn = timesDecimals(amountIn, fromAssetDecimals); // 卖出的资产数量
      const tokenPath = [...this.tokenPath]; // 直接使用计算出的tokenPath
      const tokenOut = nerve.swap.token(this.originalToAsset.chainId, this.originalToAsset.assetId);
      const tx = await nerve.swap.swapTradeStableRemoveLp(
        fromAddress,
        swapAmountIn,
        tokenPath,
        amountOutMin,
        feeTo,
        deadline,
        toAddress,
        tokenOut,
        remark
      );
      return nerve.deserializationTx(tx.hex);
    } else {
      console.log('12322222')
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
  async sendNerveStableSwapTransaction(amount, fromAddress, tokenOutIndex, isFromLpAsset, isToLpAsset, tokenIndexList) {
    console.log(isFromLpAsset, '==sendNerveStableSwapTransaction==');
    const stablePairAddress = this.originalFromAsset.channelInfo && this.originalFromAsset.channelInfo['NERVE'] && this.originalFromAsset.channelInfo['NERVE'].pairAddress || this.chooseFromAsset.channelInfo && this.chooseFromAsset.channelInfo['NERVE'] && this.chooseFromAsset.channelInfo['NERVE'].pairAddress || this.chooseToAsset.channelInfo && this.chooseToAsset.channelInfo['NERVE'] && this.chooseToAsset.channelInfo['NERVE'].pairAddress || this.originalToAsset.channelInfo && this.originalToAsset.channelInfo['NERVE'] && this.originalToAsset.channelInfo['NERVE'].pairAddress;
    const amountIn = timesDecimals(amount || 0, this.originalFromAsset.decimals);
    const amountIns = [nerve.swap.tokenAmount(this.originalFromAsset.chainId, this.originalFromAsset.assetId, amountIn)];
    const feeTo = null;
    const deadline = nerve.swap.currentTime() + 300;
    const toAddress = fromAddress;
    const remark = 'stable swap trade remark...';
    let tx;
    if (isFromLpAsset) {
      tx = await nerve.swap.stableSwapRemoveLiquidity(
        fromAddress,
        stablePairAddress,
        amountIns[0],
        tokenIndexList,
        deadline,
        toAddress,
        remark
      );
    } else if (isToLpAsset) {
      tx = await nerve.swap.stableSwapAddLiquidity(
        fromAddress,
        stablePairAddress,
        amountIns,
        deadline,
        toAddress,
        remark
      );
    } else {
      tx = await nerve.swap.stableSwapTrade(
        fromAddress,
        stablePairAddress,
        amountIns,
        tokenOutIndex,
        feeTo,
        deadline,
        toAddress,
        remark
      );
    }
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
    if (res.code === 1000 && res.data.swapSuccAmount != 0) {
      return {
        crossChainFee: res.data.crossFee,
        swapFee: res.data.swapFee,
        orderId: res.data.orderId,
        swapSuccAmount: res.data.swapSuccAmount
      };
    }
    return null;
  }
  // 发送nerve通道异构链稳定币兑换交易
  async sendNerveBridgeTransaction(params) {
    console.log('==sendNerveBridgeTransaction==');
    const { fromNetwork } = params;
    if (fromNetwork === TRON) {
      const tron = new TronLink();
      const hash = await tron.crossOutToNerveII(params);
      return {
        hash
      };
    } else {
      const transfer = new ETransfer();
      return await transfer.crossInII(params);
    }
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
      NULSContractTxData,
      nativeId
    } = params;
    const originCrossChainFee = currentChannel.originCrossChainFee || 0;
    let type = 2;
    let txData = {};
    let transferInfo = {
      from: currentAccount && currentAccount['address'][fromNetwork] || currentAccount && currentAccount['address'][nativeId] || '',
      to: swapNerveAddress,
      amount: amountIn,
      // fee: timesDecimals(fee, MAIN_INFO['decimal']),
      fee: 0,
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
        from: currentAccount && currentAccount['address']['NERVE'] || '',
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
        from: currentAccount && currentAccount['address']['NULS'] || '',
        to: swapNulsAddress,
        originCrossChainFee,
        fromAsset,
        currentAccount,
        toNetwork
      };
      console.log(data, '213123data');
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
        }, {
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
        }, {
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
    const { to, originCrossChainFee, fromAsset } = data;
    const { inputs, outputs } = data.inputOutputs;
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

export const getENULSFeeInfo = async(params) => {
  const res = await request({
    url: '/swap/enuls/route',
    data: params
  });
  if (res.code === 1000 && res.data) {
    return {
      contractAddress: res.data.contractAddress,
      swapFee: 0,
      token0: res.data.token0,
      token1: res.data.token1
    };
  }
  return null;
};

export const senENULSTransaction = async(params) => {
  console.log('==senENULSTransaction==');
  const transfer = new ETransfer();
  const { value, token0, token1, fromAsset } = params;
  if (token0 === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    return await transfer.commonTransfer({ value, to: token1 });
  } else {
    const wallet = transfer.provider.getSigner();
    const contracts = new ethers.Contract(token0, withDrawAbi, wallet);
    const amount = timesDecimals(value, fromAsset.decimals || 18);
    return contracts.withdraw(amount);
  }
};
