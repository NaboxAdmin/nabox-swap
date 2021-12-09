const ABIConfig = [
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_amount',
        'type': 'uint256'
      }
    ],
    'name': 'deposit',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_amount',
        'type': 'uint256'
      }
    ],
    'name': 'withdraw',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
];

const pancakeABI = [
  {
    'constant': true,
    'inputs': [],
    'name': 'getReserves',
    'outputs': [
      { 'internalType': 'uint112', 'name': '_reserve0', 'type': 'uint112' },
      {
        'internalType': 'uint112',
        'name': '_reserve1',
        'type': 'uint112'
      }, { 'internalType': 'uint32', 'name': '_blockTimestampLast', 'type': 'uint32' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'token0',
    'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'token1',
    'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }
];

export {
  ABIConfig,
  pancakeABI
};
