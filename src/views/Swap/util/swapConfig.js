export const ISWAP_VERSION = 'V4-swap';
export const ISWAP_BRIDGE_VERSION = 'V4-bridge';

// swap异构链合约
export const contractConfig = {
  128: '0x0d2b9ddC064BA358bB2a4960EbF7C616bb0fB7D7',
  56: '0x158605f71d08a50f9FEC5c5a59232348f337f3A3',
  137: '0xC2952a8741E6aD595901dD3E23fa154192457492',
  66: '0x1A1CD02fd7EDE2D54FddFFEdc1B8b9bbE96Af6e1',
  1: '0x3c528E392b2e726b05f4952fd91A716537501204',
  43114: '0x10aF90fcDE0bE9c045e1662Ede4C70be12A24cD0',
  42161: '0x3f7934d9C827BcBfcB818Eed85Ed654CD448127c',
  250: '0xcc1Cc8Da6f1c9348571d1FB73253d2a0F236dfc5'
};

// bridge异构链合约
export const contractBridgeConfig = {
  128: '0x04dfae6a2Ebafc38a50Ea2E5765a0fA5D98E2DB0',
  56: '0xC18A7E22b019dBCAf35554D9E88f6B0cf6eC4D22',
  137: '0xFCCaC406c3115F4D6B98cDB89B462b48ee03dF3b',
  66: '0xb576c33f78B2D4228170Dd56fc6fC60727aA78cF',
  1: '0x68169fE1bD460F16EE69327BcEf628564d05DD0F',
  43114: '0x3307c46a1e9633025D2e89658c7502A683585450',
  42161: '0xf5AFCd6d9686d92A71a5366c8D2547f2518f8A66',
  250: '0xC22C936eAf9Bca807a2E664aB8174f643021A8dC'
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

// iSwap USDT 配置
export const ISWAP_USDT_CONFIG = {
  1: 'USDT',
  56: 'USDT',
  66: 'USDT',
  128: 'USDT',
  137: 'USDT',
  250: 'fUSDT',
  42161: 'USDT',
  43114: 'USDT.e'
};

export const localChannelList = [
  {
    'id': 1,
    'channel': 'iSwap',
    'icon': 'https://nuls-cf.oss-us-west-1.aliyuncs.com/dapp/iSwap-swap.svg',
    'swap': true,
    'crossSwap': true,
    'bridge': true,
    'status': 1
  },
  {
    'id': 2,
    'channel': 'NERVE',
    'icon': 'https://nuls-cf.oss-us-west-1.aliyuncs.com/dapp/Nerve_swap.png',
    'swap': true,
    'crossSwap': false,
    'bridge': true,
    'status': 1 },
  {
    'id': 3,
    'channel': 'DODO',
    'icon': 'https://nuls-cf.oss-us-west-1.aliyuncs.com/dapp/DODO-swap.png',
    'swap': true,
    'crossSwap': false,
    'bridge': false,
    'status': 0
  }
];
