"use strict";
exports.__esModule = true;
exports.ABIMultiCallContract = void 0;
exports.ABIMultiCallContract = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "target",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "callData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct Multicall.Call[]",
                "name": "calls",
                "type": "tuple[]"
            },
            {
                "internalType": "bool",
                "name": "strict",
                "type": "bool"
            }
        ],
        "name": "aggregateStrict",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "blockNumber",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct Multicall.Return[]",
                "name": "returnData",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
