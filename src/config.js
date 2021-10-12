
//开发模式
export const IS_DEV = process.env.NODE_ENV === 'development';

// 当前网络
export const currentNet = 'mainnet';

//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = 'NERVEepb63T1M8JgQ26jwZpZXYL8ZMLdUAK31L';

//ChainId和资产ID
export const MAIN_INFO = { chainId: 9, assetId: 1, prefix: 'NERVE', symbol: "NVT", decimal: 8, rpc: "https://public.nerve.network" };
export const NULS_INFO = { chainId: 1, assetId: 1, prefix: 'NULS',symbol:"NULS", decimal: 8, rpc: "https://public1.nuls.io" };

//ETH 网络信息 测试网:ropsten, 主网:homestead
export const ETHNET = 'homestead';

// export const BRIDGE_API_URL = "http://api.v2.nabox.io/nabox-api";
export const BRIDGE_API_URL = "/nabox-api";

