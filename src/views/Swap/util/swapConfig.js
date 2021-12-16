export const ISWAP_VERSION = 'V4-swap';

export const contractConfig = {
  Heco: 0x0d2b9ddC064BA358bB2a4960EbF7C616bb0fB7D7,
  BSC: 0x158605f71d08a50f9FEC5c5a59232348f337f3A3,
  Polygon: 0xC2952a8741E6aD595901dD3E23fa154192457492,
  OEC: 0x1A1CD02fd7EDE2D54FddFFEdc1B8b9bbE96Af6e1,
  Ethereum: 0x3307c46a1e9633025D2e89658c7502A683585450
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

const feeInfoParams = {
  inToken: {
    amount: 1,
    chain: 128,
    address: '',
    decimals: 18,
    symbol: 'HT',
    dexInfo: {
      'routerAddress': '0xED7d5F38C79115ca12fe6C0041abb22F0A06C300',
      'factoryAddress': '0xb0b670fc1f7724119963018db0bfa86adb22d941'
    }
  },
  outToken: {
    chain: 56,
    address: '',
    amountOut: 1,
    decimals: 18,
    symbol: 'BNB',
    dexInfo: {
      routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
    }
  },
  direct: 'dest', // src dest
  channel: 'ISWAP',
  single: 'false',
  from: '0xAFB883c65A006718307cdaEE7e72ac6e4a0C99b2',
  version: 'V4-swap'
};

// const srcChainSwapInfo = ABI.encodeParameters(
//   ['address', 'uint256', 'uint256', 'uint256'],
//   [
//     $inToken.dexInfo.routerAddress,
//     amount0In.toFixed(0),
//     amount0OutMin.toFixed(0),
//     Math.floor((Date.now() + 1000 * 60 * this.$deadline) / 1000)
//   ]
// );
