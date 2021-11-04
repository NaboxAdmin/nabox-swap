// 开发模式
export const IS_DEV = process.env.NODE_ENV === 'development';

export const currentNet = 'testnet';

//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = 'TNVTdTSPGwjgRMtHqjmg8yKeMLnpBpVN5ZuuY';

//chainId、assetId、prefix
export const MAIN_INFO = { chainId: 5, assetId: 1, prefix: 'TNVT',symbol:"NVT", decimal: 8, rpc: "http://beta.public.nerve.network" };
export const NULS_INFO = { chainId: 2, assetId: 1, prefix: 'tNULS',symbol:"NULS", decimal: 8, rpc: "http://beta.public1.nuls.io" };
export const USDTN_INFO = {
    Ethereum: { chainId: 101, contractAddress: "0x379dc136068c18a02fa968a78da0022db02f50df", multySignAddress: "0x7d759a3330cec9b766aa4c889715535eed3c0484", symbol: "USDTN" },
    BSC: { chainId: 102, contractAddress: "0x379dc136068c18a02fa968a78da0022db02f50df", multySignAddress: "0xf7915d4de86b856f3e51b894134816680bf09eee", symbol: "USDTN" },
    Heco: { chainId: 103, contractAddress: "0x379dc136068c18a02fa968a78da0022db02f50df", multySignAddress: "0x379dc136068c18a02fa968a78da0022db02f50df", symbol: "USDTN" },
    OKExChain: { chainId: 104, contractAddress: "0x379dc136068c18a02fa968a78da0022db02f50df", multySignAddress: "0x74a163fcd791ec7aab2204ffabf1a1dfb8854883", symbol: "USDTN" }
};

//ETH 网络信息 测试网:ropsten, 主网:homestead
export const ETHNET = 'ropsten';

// export const BRIDGE_API_URL = "/nabox-api";
export const BRIDGE_API_URL = IS_DEV ? "/nabox-api" : "http://nabox_api.zhoulijun.top/nabox-api";
// export const BRIDGE_API_URL = "http://nabox_api.zhoulijun.top/nabox-api";
