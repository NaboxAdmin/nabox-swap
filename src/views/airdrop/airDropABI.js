const airDropABI = [
  { // userinfo
    'inputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'name': 'userInfo',
    'outputs': [
      {
        'internalType': 'uint8',
        'name': 'f',
        'type': 'uint8'
      },
      {
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'lastRewardBlock',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'receivedCandy',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  { // etLockedToken
    'inputs': [
      {
        'internalType': 'address',
        'name': '_user',
        'type': 'address'
      }
    ],
    'name': 'getLockedToken',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  { // pendingToken
    'inputs': [
      {
        'internalType': 'address',
        'name': '_user',
        'type': 'address'
      }
    ],
    'name': 'pendingToken',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  }
];

export {
  airDropABI
};
