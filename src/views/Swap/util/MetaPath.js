import { request } from '@/network/http';
import { Division, Minus, Times, timesDecimals, tofix, TRON } from '@/api/util';
import { ETransfer } from '@/api/api';
import TronLink from '@/api/tronLink';

const customUrl = process.env.NODE_ENV === 'production' ? 'https://api.paths.finance' : 'https://api.paths.finance';

export async function getMultiQuote(params, amountIn) {
  try {
    const res = await request({
      // method: 'get',
      // url: '/api/multiQuote',
      url: '/swap/swft/multi/quote',
      data: params
      // customUrl
    });
    if (res.resCode == '100' && res.data && res.data.txData.length > 0) {
      const resData = res.data.txData[0];
      const orderParams = getOrderParams(params, resData);
      if (resData.dex !== 'SWFT' || (resData.dex === 'SWFT' && (Minus(resData.depositMin, amountIn) < 0 && Minus(resData.depositMax, amountIn) > 0))) {
        const orderRes = await request({
          url: '/api/commonSwap',
          data: orderParams,
          customUrl
        });
        if (orderRes.resCode == '100' && orderRes.data && orderRes.data.txData) {
          return {
            ...resData,
            fee: resData.fee.toString(),
            approveAddress: resData.dex !== 'SWFT' && orderRes.data.txData.to || '',
            txData: orderRes.data.txData,
            platformAddress: orderRes.data.txData.platformAddr || '', // SWFT直接转到这个地址
            orderId: res.orderId
          };
        } else {
          // @fixme 防止swft调用失败
          if (res.data.txData[1]) {
            const tempData = res.data.txData[1];
            const orderParams = getOrderParams(params, tempData);
            const orderRes = await request({
              url: '/api/commonSwap',
              data: orderParams,
              customUrl
            });
            if (orderRes.resCode == '100' && orderRes.data && orderRes.data.txData) {
              return {
                ...tempData,
                fee: tempData.fee.toString(),
                approveAddress: tempData.dex !== 'SWFT' && orderRes.data.txData.to || '',
                txData: orderRes.data.txData,
                platformAddress: orderRes.data.txData.platformAddr || '', // SWFT直接转到这个地址
                orderId: res.orderId
              };
            }
          }
          return null;
        }
      }
      return {
        ...resData,
        fee: resData.fee.toString(),
        orderId: res.orderId
      };
    }
    return null;
  } catch (e) {
    console.log(e, 'error');
  }
}

export function getEquipmentNo(address) {
  let equipmentNo = '';
  if (address.length <= 32) {
    const n = 32 - address.length;
    for (let i = 0; i < n; i++) {
      equipmentNo += 'x';
    }
    equipmentNo += address;
  } else {
    equipmentNo = address.slice(0, 32);
  }
  return equipmentNo;
}

export async function metaPathRecordHash(params) {
  return await request({
    url: '/api/exchangeRecord/addTransData',
    data: params,
    customUrl
  });
}

export async function sendMetaPathTransaction(orderInfo) {
  const { currentChannel, amountIn, fromAsset, fromNetwork } = orderInfo;
  if (currentChannel.dex === 'SWFT') {
    if (fromNetwork === TRON) {
      const tron = new TronLink();
      if (!fromAsset.contractAddress) {
        const res = await tron.sendTrx(currentChannel.platformAddress, amountIn);
        return {
          hash: res.txid
        };
      } else {
        const res = await tron.sendTrc20(currentChannel.platformAddress, amountIn, fromAsset.contractAddress, fromAsset.decimals);
        return {
          hash: res.txid
        };
      }
    } else {
      const transfer = new ETransfer();
      const params = {
        to: currentChannel.platformAddress,
        value: amountIn,
        decimals: fromAsset.decimals || 18,
        contractAddress: fromAsset.contractAddress || ''
      };
      return await transfer.commonTransfer(params);
    }
  } else {
    if (fromNetwork === TRON) {
      const tron = new TronLink();
      const params = currentChannel.txData;
      const res = await tron.triggerSmartContract(params);
      return {
        hash: res.txid
      };
    } else {
      const { from, to, data, value } = currentChannel.txData;
      const transfer = new ETransfer();
      const tempTxData = await transfer.setGasLimit({
        from,
        to,
        value,
        data
      });
      return await transfer.sendTransaction(tempTxData);
    }
  }
}

function getOrderParams(params, resData) {
  return {
    equipmentNo: params.equipmentNo,
    fromTokenAddress: params.fromTokenAddress,
    toTokenAddress: params.toTokenAddress,
    fromAddress: params.userAddr,
    toAddress: params.toAddress,
    // amountOutMin: timesDecimals(Times(resData.receiveTokenAmount, Division(Minus(100, params.slippage || '2'), 100)), resData.toTokenDecimal).toString(),
    amountOutMin: timesDecimals(tofix(Times(resData.receiveTokenAmount || resData.toTokenAmount, Division(Minus(100, params.slippage || '2'), 100)), resData.toTokenDecimal), resData.toTokenDecimal).toString(),
    routerPath: resData.path,
    amounts: [],
    dex: resData.dex,
    aggregator: '',
    fromTokenChain: params.fromTokenChain,
    toTokenChain: params.toTokenChain,
    fromTokenAmount: params.fromTokenAmount,
    slippage: params.slippage
  };
}
