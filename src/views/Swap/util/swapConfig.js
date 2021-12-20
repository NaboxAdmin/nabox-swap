export const ISWAP_VERSION = 'V4-swap';
export const ISWAP_ETH = 'ETH'; // iSwap 兑换 ETH 单独处理
export const contractConfig = {
  Heco: '0x0d2b9ddC064BA358bB2a4960EbF7C616bb0fB7D7',
  BSC: '0x158605f71d08a50f9FEC5c5a59232348f337f3A3',
  Polygon: '0xC2952a8741E6aD595901dD3E23fa154192457492',
  OEC: '0x1A1CD02fd7EDE2D54FddFFEdc1B8b9bbE96Af6e1',
  Ethereum: '0x3c528E392b2e726b05f4952fd91A716537501204'
};

// 发送交易的ABI
export const iSwapContractAbiConfig = [
  // 链内兑换
  { // token to token
    'inputs': [
      {
        'internalType': 'address',
        'name': 'router',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'amountIn',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'amountOutMin',
        'type': 'uint256'
      },
      {
        'internalType': 'address[]',
        'name': 'path',
        'type': 'address[]'
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'deadline',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32',
        'name': 'channel',
        'type': 'bytes32'
      }
    ],
    'name': 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  { // ETH to token
    'inputs': [
      {
        'internalType': 'address',
        'name': 'router',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'amountOutMin',
        'type': 'uint256'
      },
      {
        'internalType': 'address[]',
        'name': 'path',
        'type': 'address[]'
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'deadline',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32',
        'name': 'channel',
        'type': 'bytes32'
      }
    ],
    'name': 'swapExactETHForTokensSupportingFeeOnTransferTokens',
    'outputs': [],
    'stateMutability': 'payable',
    'type': 'function'
  },
  { // token to ETH
    'inputs': [
      {
        'internalType': 'address',
        'name': 'router',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'amountIn',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'amountOutMin',
        'type': 'uint256'
      },
      {
        'internalType': 'address[]',
        'name': 'path',
        'type': 'address[]'
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'deadline',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32',
        'name': 'channel',
        'type': 'bytes32'
      }
    ],
    'name': 'swapExactTokensForETHSupportingFeeOnTransferTokens',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  // 跨链兑换
  { // token to token
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'orderId',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'gasFee',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'crossChainFee',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'dstChainId',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32',
        'name': 'channel',
        'type': 'bytes32'
      },
      {
        'internalType': 'address[]',
        'name': 'srcPath',
        'type': 'address[]'
      },
      {
        'internalType': 'bytes',
        'name': 'srcChainSwapCallData',
        'type': 'bytes'
      },
      {
        'internalType': 'bytes',
        'name': 'dstChainSwapInfo',
        'type': 'bytes'
      }
    ],
    'name': 'swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  { // ETH to token
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'orderId',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'gasFee',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'crossChainFee',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'dstChainId',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes32',
        'name': 'channel',
        'type': 'bytes32'
      },
      {
        'internalType': 'address[]',
        'name': 'srcPath',
        'type': 'address[]'
      },
      {
        'internalType': 'bytes',
        'name': 'srcChainSwapCallData',
        'type': 'bytes'
      },
      {
        'internalType': 'bytes',
        'name': 'dstChainSwapInfo',
        'type': 'bytes'
      }
    ],
    'name': 'swapExactETHForTokensSupportingFeeOnTransferTokensCrossChain',
    'outputs': [],
    'stateMutability': 'payable',
    'type': 'function'
  }
];

// const srcChainSwapInfo = ABI.encodeParameters(
//   ['address', 'uint256', 'uint256', 'uint256'],
//   [
//     $inToken.dexInfo.routerAddress,
//     amount0In.toFixed(0),
//     amount0OutMin.toFixed(0),
//     Math.floor((Date.now() + 1000 * 60 * this.$deadline) / 1000)
//   ]
// );
