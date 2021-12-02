const farmABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }],
        "name": "getUserInfo",
        "outputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_rewardDebt",
            "type": "uint256"
        }, {"internalType": "uint128", "name": "_lockSize", "type": "uint128"}, {
            "internalType": "uint256",
            "name": "_lockedReward",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }],
        "name": "getLocks", // 获取锁定的
        "outputs": [
            {"internalType": "uint128", "name": "length", "type": "uint128"},
            {"internalType": "uint256[]","name": "_amounts","type": "uint256[]"},
            {"internalType": "uint256[]", "name": "_unlockNumbers", "type": "uint256[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }, {"internalType": "uint128", "name": "_index", "type": "uint128"}],
        "name": "getLockByIndex",
        "outputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "_unlockNumber",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_pid", "type": "uint256"},
            {"internalType": "address","name": "_user","type": "address"},
            {"internalType": "bool", "name": "asc", "type": "bool"}
        ],
        "name": "getUnlockedToken",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }],
        "name": "pendingToken",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

export {
    farmABI
}