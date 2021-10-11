//开发模式
export const IS_DEV = process.env.NODE_ENV === 'development';

export const currentNet = 'testnet';

//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = 'TNVTdTSPGwjgRMtHqjmg8yKeMLnpBpVN5ZuuY';

//chainId、assetId、prefix
export const MAIN_INFO = { chainId: 5, assetId: 1, prefix: 'TNVT',symbol:"NVT", decimal: 8, rpc: "http://beta.public.nerve.network" };
export const NULS_INFO = { chainId: 2, assetId: 1, prefix: 'tNULS',symbol:"NULS", decimal: 8, rpc: "http://beta.public1.nuls.io" };

//ETH 网络信息 测试网:ropsten, 主网:homestead
export const ETHNET = 'ropsten';

// export const BRIDGE_API_URL = "/nabox-api";
export const BRIDGE_API_URL = "http://nabox_api.zhoulijun.top/nabox-api";
