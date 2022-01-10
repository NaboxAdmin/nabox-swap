export const ISWAP_VERSION = 'V4-swap';

// swap异构链合约
export const contractConfig = {
  Heco: '0x0d2b9ddC064BA358bB2a4960EbF7C616bb0fB7D7',
  BSC: '0x158605f71d08a50f9FEC5c5a59232348f337f3A3',
  Polygon: '0xC2952a8741E6aD595901dD3E23fa154192457492',
  OKExChain: '0x1A1CD02fd7EDE2D54FddFFEdc1B8b9bbE96Af6e1',
  Ethereum: '0x3c528E392b2e726b05f4952fd91A716537501204'
};

// bridge异构链合约
export const contractBridgeConfig = {
  Heco: '0x04dfae6a2Ebafc38a50Ea2E5765a0fA5D98E2DB0',
  BSC: '0xC18A7E22b019dBCAf35554D9E88f6B0cf6eC4D22',
  Polygon: '0xFCCaC406c3115F4D6B98cDB89B462b48ee03dF3b',
  OKExChain: '0xb576c33f78B2D4228170Dd56fc6fC60727aA78cF',
  Ethereum: '0x68169fE1bD460F16EE69327BcEf628564d05DD0F'
};

// 发送Swap交易的ABI
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

// 发送Bridge交易的ABI
export const iSwapContractBridgeAbiConfig = [
  { // token => token
    'inputs': [
      {
        'components': [
          {
            'internalType': 'uint256',
            'name': 'orderId',
            'type': 'uint256'
          },
          {
            'internalType': 'address',
            'name': 'asset',
            'type': 'address'
          },
          {
            'internalType': 'address',
            'name': 'from',
            'type': 'address'
          },
          {
            'internalType': 'address',
            'name': 'to',
            'type': 'address'
          },
          {
            'internalType': 'uint256',
            'name': 'amount',
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
            'name': 'rewards',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'srcChainId',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'dstChainId',
            'type': 'uint256'
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
        'internalType': 'struct IHub.Order',
        'name': 'order',
        'type': 'tuple'
      }
    ],
    'name': 'crossChainToken',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  { // eth => token
    'inputs': [
      {
        'components': [
          {
            'internalType': 'uint256',
            'name': 'orderId',
            'type': 'uint256'
          },
          {
            'internalType': 'address',
            'name': 'asset',
            'type': 'address'
          },
          {
            'internalType': 'address',
            'name': 'from',
            'type': 'address'
          },
          {
            'internalType': 'address',
            'name': 'to',
            'type': 'address'
          },
          {
            'internalType': 'uint256',
            'name': 'amount',
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
            'name': 'rewards',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'srcChainId',
            'type': 'uint256'
          },
          {
            'internalType': 'uint256',
            'name': 'dstChainId',
            'type': 'uint256'
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
        'internalType': 'struct IHub.Order',
        'name': 'order',
        'type': 'tuple'
      }
    ],
    'name': 'crossChainETH',
    'outputs': [],
    'stateMutability': 'payable',
    'type': 'function'
  }
];

export const ISWAP_USDT_CONFIG = {
  1: 'USDT',
  56: 'USDT',
  66: 'USDT',
  128: 'USDT',
  137: 'USDT'
};
