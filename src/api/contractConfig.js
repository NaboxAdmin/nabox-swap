export const contractAddress = '0x0faee22173db311f4c57c81ec6867e5deef6c218';

// export const abi = [
//     "function owner() public view returns (address)",
//     "function pendingToken(uint256 _pid, address _user) external view returns (uint256)",
//     "function poolInfo(uint256 input) external view returns (address,address,uint256,uint256,uint256,uint256,uint256)",
//     "function poolLength() external view returns (uint256)",
//     "function userInfo(uint256 _pid, address _user) external view returns (uint256,uint256)"
// ];

export const abiTwo = [
  'function symbol() public view returns (string)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() public view returns (uint8)'
];

export const abiThree = [
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)'
];

// export const txAbi = [
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "user",
//         type: "address"
//       },
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "pid",
//         type: "uint256"
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256"
//       }
//     ],
//     name: "Deposit",
//     type: "event"
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "user",
//         type: "address"
//       },
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "pid",
//         type: "uint256"
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256"
//       }
//     ],
//     name: "EmergencyWithdraw",
//     type: "event"
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "previousOwner",
//         type: "address"
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newOwner",
//         type: "address"
//       }
//     ],
//     name: "OwnershipTransferred",
//     type: "event"
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "user",
//         type: "address"
//       },
//       {
//         indexed: true,
//         internalType: "uint256",
//         name: "pid",
//         type: "uint256"
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "amount",
//         type: "uint256"
//       }
//     ],
//     name: "Withdraw",
//     type: "event"
//   },
//   {
//     inputs: [
//       {
//         internalType: "contract IERC20",
//         name: "_lpToken",
//         type: "address"
//       },
//       {
//         internalType: "contract IERC20",
//         name: "_candyToken",
//         type: "address"
//       },
//       {
//         internalType: "uint256",
//         name: "_candyPerBlock",
//         type: "uint256"
//       },
//       { internalType: "uint256", name: "_amount", type: "uint256" },
//       {
//         internalType: "bool",
//         name: "_withUpdate",
//         type: "bool"
//       }
//     ],
//     name: "add",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "_pid", type: "uint256" },
//       {
//         internalType: "uint256",
//         name: "_amount",
//         type: "uint256"
//       },
//       { internalType: "bool", name: "_withUpdate", type: "bool" }
//     ],
//     name: "addCandy",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "_pid", type: "uint256" },
//       {
//         internalType: "uint256",
//         name: "_amount",
//         type: "uint256"
//       }
//     ],
//     name: "deposit",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
//     name: "emergencyWithdraw",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_startBlock",
//         type: "uint256"
//       },
//       { internalType: "address", name: "_devAddr", type: "address" }
//     ],
//     name: "initialize",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [],
//     name: "massUpdatePools",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [],
//     name: "owner",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function"
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "_pid", type: "uint256" },
//       {
//         internalType: "address",
//         name: "_user",
//         type: "address"
//       }
//     ],
//     name: "pendingToken",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function"
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     name: "poolInfo",
//     outputs: [
//       {
//         internalType: "contract IERC20",
//         name: "lpToken",
//         type: "address"
//       },
//       {
//         internalType: "contract IERC20",
//         name: "candyToken",
//         type: "address"
//       },
//       {
//         internalType: "uint256",
//         name: "lastRewardBlock",
//         type: "uint256"
//       },
//       { internalType: "uint256", name: "accPerShare", type: "uint256" },
//       {
//         internalType: "uint256",
//         name: "candyPerBlock",
//         type: "uint256"
//       },
//       { internalType: "uint256", name: "lpSupply", type: "uint256" },
//       {
//         internalType: "uint256",
//         name: "candyBalance",
//         type: "uint256"
//       }
//     ],
//     stateMutability: "view",
//     type: "function"
//   },
//   {
//     inputs: [],
//     name: "poolLength",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function"
//   },
//   {
//     inputs: [],
//     name: "renounceOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
//     name: "transferOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
//     name: "updatePool",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "", type: "uint256" },
//       {
//         internalType: "address",
//         name: "",
//         type: "address"
//       }
//     ],
//     name: "userInfo",
//     outputs: [
//       { internalType: "uint256", name: "amount", type: "uint256" },
//       {
//         internalType: "uint256",
//         name: "rewardDebt",
//         type: "uint256"
//       }
//     ],
//     stateMutability: "view",
//     type: "function"
//   },
//   {
//     inputs: [
//       { internalType: "uint256", name: "_pid", type: "uint256" },
//       {
//         internalType: "uint256",
//         name: "_amount",
//         type: "uint256"
//       }
//     ],
//     name: "withdraw",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function"
//   }
// ];

export const txAbi = [
  {
    'anonymous': false,
    'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address' }, {
      'indexed': true,
      'internalType': 'uint256',
      'name': 'pid',
      'type': 'uint256'
    }, { 'indexed': false, 'internalType': 'uint256', 'name': 'candyAmount', 'type': 'uint256' }, {
      'indexed': false,
      'internalType': 'bool',
      'name': 'withUpdate',
      'type': 'bool'
    }],
    'name': 'AddCandy',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address' }, {
      'indexed': false,
      'internalType': 'address',
      'name': 'lpToken',
      'type': 'address'
    }, { 'indexed': false, 'internalType': 'address', 'name': 'candyToken', 'type': 'address' }, {
      'indexed': false,
      'internalType': 'uint16',
      'name': 'lockDays',
      'type': 'uint16'
    }, { 'indexed': false, 'internalType': 'uint256', 'name': 'candyBalance', 'type': 'uint256' }],
    'name': 'AddPool',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address' }, {
      'indexed': true,
      'internalType': 'uint256',
      'name': 'pid',
      'type': 'uint256'
    }, { 'indexed': false, 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }],
    'name': 'Deposit',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address' }, {
      'indexed': true,
      'internalType': 'uint256',
      'name': 'pid',
      'type': 'uint256'
    }, { 'indexed': false, 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }],
    'name': 'EmergencyWithdraw',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{
      'indexed': true,
      'internalType': 'address',
      'name': 'previousOwner',
      'type': 'address'
    }, { 'indexed': true, 'internalType': 'address', 'name': 'newOwner', 'type': 'address' }],
    'name': 'OwnershipTransferred',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address' }, {
      'indexed': true,
      'internalType': 'uint256',
      'name': 'pid',
      'type': 'uint256'
    }, { 'indexed': false, 'internalType': 'uint256', 'name': 'startBlock', 'type': 'uint256' }],
    'name': 'UpdateStartBlock',
    'type': 'event'
  }, {
    'anonymous': false,
    'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address' }, {
      'indexed': true,
      'internalType': 'uint256',
      'name': 'pid',
      'type': 'uint256'
    }, { 'indexed': false, 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }],
    'name': 'Withdraw',
    'type': 'event'
  }, {
    'inputs': [{ 'internalType': 'uint16', 'name': '_lockDays', 'type': 'uint16' }, {
      'internalType': 'uint256',
      'name': '_minuteBlockCount',
      'type': 'uint256'
    }, { 'internalType': 'contract IERC20', 'name': '_lpToken', 'type': 'address' }, {
      'internalType': 'contract IERC20',
      'name': '_candyToken',
      'type': 'address'
    }, { 'internalType': 'uint256', 'name': '_candyPerBlock', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_amount',
      'type': 'uint256'
    }, { 'internalType': 'uint256', 'name': '_startBlock', 'type': 'uint256' }, {
      'internalType': 'bool',
      'name': '_withUpdate',
      'type': 'bool'
    }], 'name': 'add', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_amount',
      'type': 'uint256'
    }, { 'internalType': 'bool', 'name': '_withUpdate', 'type': 'bool' }],
    'name': 'addCandy',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_amount',
      'type': 'uint256'
    }], 'name': 'deposit', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_amount',
      'type': 'uint256'
    }], 'name': 'depositDesc', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }],
    'name': 'emergencyWithdraw',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'address',
      'name': '_user',
      'type': 'address'
    }, { 'internalType': 'uint128', 'name': '_index', 'type': 'uint128' }],
    'name': 'getLockByIndex',
    'outputs': [{ 'internalType': 'uint256', 'name': '_amount', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_unlockNumber',
      'type': 'uint256'
    }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'address',
      'name': '_user',
      'type': 'address'
    }],
    'name': 'getLocks',
    'outputs': [{ 'internalType': 'uint128', 'name': 'length', 'type': 'uint128' }, {
      'internalType': 'uint256[]',
      'name': '_amounts',
      'type': 'uint256[]'
    }, { 'internalType': 'uint256[]', 'name': '_unlockNumbers', 'type': 'uint256[]' }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'address',
      'name': '_user',
      'type': 'address'
    }],
    'name': 'getRecentlyLock',
    'outputs': [{ 'internalType': 'uint256', 'name': '_amount', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_unlockNumber',
      'type': 'uint256'
    }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'address',
      'name': '_user',
      'type': 'address'
    }],
    'name': 'getUnlockedToken',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'address',
      'name': '_user',
      'type': 'address'
    }],
    'name': 'getUserInfo',
    'outputs': [{ 'internalType': 'uint256', 'name': '_amount', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_rewardDebt',
      'type': 'uint256'
    }, { 'internalType': 'uint128', 'name': '_lockSize', 'type': 'uint128' }, {
      'internalType': 'uint256',
      'name': '_lockedReward',
      'type': 'uint256'
    }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [],
    'name': 'massUpdatePools',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'inputs': [],
    'name': 'owner',
    'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'address',
      'name': '_user',
      'type': 'address'
    }],
    'name': 'pendingToken',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'name': 'poolInfo',
    'outputs': [{ 'internalType': 'uint16', 'name': 'lockDays', 'type': 'uint16' }, {
      'internalType': 'uint256',
      'name': 'dayBlockCount',
      'type': 'uint256'
    }, { 'internalType': 'uint256', 'name': 'totalBlockCount', 'type': 'uint256' }, {
      'internalType': 'contract IERC20',
      'name': 'lpToken',
      'type': 'address'
    }, { 'internalType': 'contract IERC20', 'name': 'candyToken', 'type': 'address' }, {
      'internalType': 'uint256',
      'name': 'startBlock',
      'type': 'uint256'
    }, { 'internalType': 'uint256', 'name': 'lastRewardBlock', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': 'accPerShare',
      'type': 'uint256'
    }, { 'internalType': 'uint256', 'name': 'candyPerBlock', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': 'lpSupply',
      'type': 'uint256'
    }, { 'internalType': 'uint256', 'name': 'candyBalance', 'type': 'uint256' }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [],
    'name': 'poolLength',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'stateMutability': 'view',
    'type': 'function'
  }, {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'address', 'name': 'newOwner', 'type': 'address' }],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }],
    'name': 'updatePool',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_startBlock',
      'type': 'uint256'
    }], 'name': 'updateStartBlock', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_amount',
      'type': 'uint256'
    }], 'name': 'withdraw', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
  }, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_pid', 'type': 'uint256' }, {
      'internalType': 'uint256',
      'name': '_amount',
      'type': 'uint256'
    }], 'name': 'withdrawDesc', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
  }];

export const withDrawAbi = [
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'payable': false,
    'outputs': [],
    'name': 'withdraw',
    'inputs': [{ 'type': 'uint256', 'name': 'wad', 'internalType': 'uint256' }],
    'constant': false }
];
