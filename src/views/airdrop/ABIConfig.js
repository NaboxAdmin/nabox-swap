const ABIConfig = [
    {
        "inputs":[
            {
                "internalType":"uint256",
                "name":"_amount",
                "type":"uint256"
            }
        ],
        "name":"deposit",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[
            {
                "internalType":"uint256",
                "name":"_amount",
                "type":"uint256"
            }
        ],
        "name":"withdraw",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    }
];

export {
    ABIConfig
};