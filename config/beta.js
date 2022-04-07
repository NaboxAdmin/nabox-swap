// 测试网
export const IS_DEV = process.env.NODE_ENV === 'development';
export const currentNet = 'testnet';
// chainId、assetId、prefix
export const MAIN_INFO = { chainId: 5, assetId: 1, prefix: 'TNVT', symbol: 'NVT', decimal: 8, rpc: 'http://beta.public.nerve.network', batchRPC: 'http://beta.api.nerve.network/jsonrpc' };
export const NULS_INFO = { chainId: 2, assetId: 1, prefix: 'tNULS', symbol: 'NULS', decimal: 8, rpc: 'http://beta.public1.nuls.io', batchRPC: ' http://beta.api.nuls.io/jsonrpc' };
// ETH 网络信息 测试网:ropsten, 主网:homestead
export const ETHNET = 'ropsten';
// export const BRIDGE_API_URL = "/nabox-api";
export const SWAP_BOX_API_URL = IS_DEV ? '/nabox-api' : 'http://122.9.162.107:19001/nabox-api';

export const localChainConfig = [
  {
    'id': 24,
    'chain': 'Ethereum',
    'chainName': 'Ethereum',
    'prefix': '0x',
    'nativeId': 3,
    'chainId': 101,
    'chainType': 2,
    'crossAddress': '0x5e1cba794aD91FCd272fDaF2cd91b6110b601ED2',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Ethereum.png',
    'apiUrl': 'https://ropsten.infura.io/v3/7e086d9f3bdc48e4996a3997b33b032f',
    'scanUrl': 'https://ropsten.etherscan.io/',
    'psUrl': 'https://faucets.chain.link/rinkeby',
    'tokenUrl': 'https://ropsten.etherscan.io/token/',
    'txUrl': 'https://ropsten.etherscan.io/tx/',
    'nft': '',
    'sort': 1,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xb966f6Df75Ff460887d66DEb0b246886374C2Fa5',
      'crossAddress': '0x5e1cba794aD91FCd272fDaF2cd91b6110b601ED2'
    },
    'mainAsset': {
      'id': 17673,
      'chain': 'Ethereum',
      'registerChain': 'Ethereum',
      'chainId': 101,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'ETH',
      'symbol': 'ETH',
      'symbolBase': 'ETH',
      'configType': 1,
      'source': 9,
      'icon': 'https://files.nabox.io/icon/ETH.png',
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 101,
          'heterogeneousChainMultySignAddress': '0x5e1cba794ad91fcd272fdaf2cd91b6110b601ed2',
          'contractAddress': '',
          'chainName': 'Ethereum',
          'token': false
        },
        {
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0xf85f03c3faac61acf7b187513aef10041029a1b2',
          'contractAddress': '0x5673e9dd71072dc975bfb146c40760b0fcbe9039',
          'chainName': 'BSC',
          'token': true
        },
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x19d90d3c8eb0c0b3e3093b054031ff1ca81704b8',
          'contractAddress': '0x56f175d48211e7d018dda7f0a0b51bcfb405ae69',
          'chainName': 'Heco',
          'token': true
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 2,
      'nerveFlag': false,
      'usdPrice': 2606.8456,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 9,
        'chain': 'Ethereum',
        'nativeId': 3,
        'name': 'eth-1',
        'apiUrl': 'https://ropsten.infura.io/v3/7e086d9f3bdc48e4996a3997b33b032f'
      }
    ]
  },
  {
    'id': 25,
    'chain': 'BSC',
    'chainName': 'BSC',
    'prefix': '0x',
    'nativeId': 97,
    'chainId': 102,
    'chainType': 2,
    'crossAddress': '0xf85f03C3fAAC61ACF7B187513aeF10041029A1b2',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/BSC.png',
    'apiUrl': 'https://data-seed-prebsc-1-s2.binance.org:8545/',
    'scanUrl': 'https://testnet.bscscan.com/',
    'psUrl': 'https://testnet.binance.org/faucet-smart',
    'tokenUrl': 'https://testnet.bscscan.com/token/',
    'txUrl': 'https://testnet.bscscan.com/tx/',
    'nft': 'bsc testnet',
    'sort': 2,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0x2e31a3FBE1796c1CeC99BD2F3E87c0f085d2afB1',
      'crossAddress': '0xf85f03C3fAAC61ACF7B187513aeF10041029A1b2'
    },
    'mainAsset': {
      'id': 17674,
      'chain': 'BSC',
      'registerChain': 'BSC',
      'chainId': 102,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'BNB',
      'symbol': 'BNB',
      'symbolBase': 'BNB',
      'configType': 1,
      'source': 9,
      'icon': 'https://files.nabox.io/icon/BNB.png',
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 101,
          'heterogeneousChainMultySignAddress': '0x5e1cba794ad91fcd272fdaf2cd91b6110b601ed2',
          'contractAddress': '0x1ecb2473d2d34c4fa081708340bfcd045a697106',
          'chainName': 'Ethereum',
          'token': true
        },
        {
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0xf85f03c3faac61acf7b187513aef10041029a1b2',
          'contractAddress': '',
          'chainName': 'BSC',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 8,
      'nerveFlag': false,
      'usdPrice': 372.0511,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 3,
        'chain': 'BSC',
        'nativeId': 97,
        'name': 'bsc-1',
        'apiUrl': 'https://data-seed-prebsc-1-s1.binance.org:8545/'
      },
      {
        'id': 13,
        'chain': 'BSC',
        'nativeId': 97,
        'name': 'bsc-2',
        'apiUrl': 'https://data-seed-prebsc-1-s2.binance.org:8545/'
      }
    ]
  },
  {
    'id': 29,
    'chain': 'Polygon',
    'chainName': 'Polygon',
    'prefix': '0x',
    'nativeId': 80001,
    'chainId': 106,
    'chainType': 2,
    'crossAddress': '0xFe05820BaE725fD093E9C1CB6E40AB3BDc40Def2',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Polygon.png',
    'apiUrl': 'https://matic-mumbai.chainstacklabs.com',
    'scanUrl': 'https://mumbai.polygonscan.com/',
    'psUrl': 'https://faucet.polygon.technology/',
    'tokenUrl': 'https://mumbai.polygonscan.com/token/',
    'txUrl': 'https://mumbai.polygonscan.com/tx/',
    'nft': '',
    'sort': 3,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0x4D3B8eFcC04cA63Be112Da5147C80c87aC969F5B',
      'crossAddress': '0xFe05820BaE725fD093E9C1CB6E40AB3BDc40Def2'
    },
    'mainAsset': {
      'id': 18894,
      'chain': 'Polygon',
      'registerChain': 'Polygon',
      'chainId': 106,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'MATIC',
      'symbol': 'MATIC',
      'symbolBase': 'MATIC',
      'configType': 1,
      'source': 4,
      'icon': 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/Polygon.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 106,
          'heterogeneousChainMultySignAddress': '0xfe05820bae725fd093e9c1cb6e40ab3bdc40def2',
          'contractAddress': '',
          'chainName': 'Polygon',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 34,
      'nerveFlag': false,
      'usdPrice': 1.4329,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 7,
        'chain': 'Polygon',
        'nativeId': 80001,
        'name': 'matic-1',
        'apiUrl': 'https://matic-mumbai.chainstacklabs.com'
      }
    ]
  },
  {
    'id': 26,
    'chain': 'Heco',
    'chainName': 'Heco',
    'prefix': '0x',
    'nativeId': 256,
    'chainId': 103,
    'chainType': 2,
    'crossAddress': '0x19d90D3C8eb0C0B3E3093B054031fF1cA81704B8',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Heco.png',
    'apiUrl': 'https://http-testnet.hecochain.com',
    'scanUrl': 'https://testnet.hecoinfo.com/',
    'psUrl': 'https://scan-testnet.hecochain.com/faucet',
    'tokenUrl': 'https://testnet.hecoinfo.com/token/',
    'txUrl': 'https://testnet.hecoinfo.com/tx/',
    'nft': '',
    'sort': 4,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0x4564512f7216a617BC8C8B1E0b2893C7CB17927e',
      'crossAddress': '0x19d90D3C8eb0C0B3E3093B054031fF1cA81704B8'
    },
    'mainAsset': {
      'id': 17675,
      'chain': 'Heco',
      'registerChain': 'Heco',
      'chainId': 103,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'HT',
      'symbol': 'HT',
      'symbolBase': 'HT',
      'configType': 1,
      'source': 4,
      'icon': 'https://files.nabox.io/icon/HT.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x19d90d3c8eb0c0b3e3093b054031ff1ca81704b8',
          'contractAddress': '',
          'chainName': 'Heco',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 9,
      'nerveFlag': false,
      'usdPrice': 8.4333,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 4,
        'chain': 'Heco',
        'nativeId': 256,
        'name': 'heco-1',
        'apiUrl': 'https://http-testnet.hecochain.com'
      }
    ]
  },
  {
    'id': 27,
    'chain': 'OKExChain',
    'chainName': 'OKExChain',
    'prefix': '0x',
    'nativeId': 65,
    'chainId': 104,
    'chainType': 2,
    'crossAddress': '0xB490F2a3eC0B90e5faa1636bE046d82AB7cdAC74',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/OKExChain.png',
    'apiUrl': 'https://exchaintestrpc.okex.org',
    'scanUrl': 'https://www.oklink.com/okexchain-test/',
    'psUrl': 'https://discord.com/invite/B5nMs6qK5F',
    'tokenUrl': 'https://www.oklink.com/okexchain-test/tokenAddr/',
    'txUrl': 'https://www.oklink.com/okexchain-test/tx/',
    'nft': '',
    'sort': 5,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0x0111E01E78af5608e33569Edd997Fe2f700A0721',
      'crossAddress': '0xB490F2a3eC0B90e5faa1636bE046d82AB7cdAC74'
    },
    'mainAsset': {
      'id': 17918,
      'chain': 'OKExChain',
      'registerChain': 'OKExChain',
      'chainId': 104,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'OKT',
      'symbol': 'OKT',
      'symbolBase': 'OKT',
      'configType': 1,
      'source': 4,
      'icon': 'https://files.nabox.io/icon/OKT.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xb490f2a3ec0b90e5faa1636be046d82ab7cdac74',
          'contractAddress': '',
          'chainName': 'OKExChain',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 12,
      'nerveFlag': false,
      'usdPrice': 34.4257,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 5,
        'chain': 'OKExChain',
        'nativeId': 65,
        'name': 'oec-1',
        'apiUrl': 'https://exchaintestrpc.okex.org'
      }
    ]
  },
  {
    'id': 32,
    'chain': 'Avalanche',
    'chainName': 'Avalanche',
    'prefix': '0x',
    'nativeId': 43113,
    'chainId': 110,
    'chainType': 2,
    'crossAddress': '0x8999d8738CC9B2E1fb1D01E1af732421D53Cb2A9',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/AVAX.png',
    'apiUrl': 'https://api.avax-test.network/ext/bc/C/rpc',
    'scanUrl': 'https://testnet.snowtrace.io/',
    'psUrl': 'https://faucet.avax-test.network/',
    'tokenUrl': 'https://testnet.snowtrace.io/token/',
    'txUrl': 'https://testnet.snowtrace.io/tx/',
    'nft': '',
    'sort': 6,
    'status': 1,
    'bridge': 1,
    'swap': 0,
    'configs': {
      'multiCallAddress': '0xC1f4F265EC8A46ad19740E7d3c6960db4c595dE5',
      'crossAddress': '0x8999d8738CC9B2E1fb1D01E1af732421D53Cb2A9'
    },
    'mainAsset': {
      'id': 19035,
      'chain': 'Avalanche',
      'registerChain': 'Avalanche',
      'chainId': 110,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'AVAX',
      'symbol': 'AVAX',
      'symbolBase': 'AVAX',
      'configType': 1,
      'source': 4,
      'icon': 'https://files.nabox.io/icon/AVAX.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 110,
          'heterogeneousChainMultySignAddress': '0x8999d8738cc9b2e1fb1d01e1af732421d53cb2a9',
          'contractAddress': '',
          'chainName': 'Avalanche',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 94,
      'nerveFlag': false,
      'usdPrice': 74.6461,
      'usdPlatform': null,
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 15,
        'chain': 'Avalanche',
        'nativeId': 43113,
        'name': 'avalanche-1',
        'apiUrl': 'https://api.avax-test.network/ext/bc/C/rpc'
      }
    ]
  },
  {
    'id': 28,
    'chain': 'Harmony',
    'chainName': 'Harmony',
    'prefix': '0x',
    'nativeId': 1666700000,
    'chainId': 105,
    'chainType': 2,
    'crossAddress': '0x0EA7cE4180E8Bc484db4be9b497d9D106a3D7781',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Harmony.png',
    'apiUrl': 'https://api.s0.pops.one/',
    'scanUrl': 'https://beta.explorer.harmony.one/',
    'psUrl': 'https://faucet.pops.one/',
    'tokenUrl': 'https://beta.explorer.harmony.one/address/',
    'txUrl': 'https://beta.explorer.harmony.one/tx/',
    'nft': '',
    'sort': 7,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0x767188de0CE73c8771E72c4caF4a18De2303DF01',
      'crossAddress': '0x0EA7cE4180E8Bc484db4be9b497d9D106a3D7781'
    },
    'mainAsset': {
      'id': 18893,
      'chain': 'Harmony',
      'registerChain': 'Harmony',
      'chainId': 105,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'ONE',
      'symbol': 'ONE',
      'symbolBase': 'ONE',
      'configType': 1,
      'source': 4,
      'icon': 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/Harmony.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 105,
          'heterogeneousChainMultySignAddress': '0x0ea7ce4180e8bc484db4be9b497d9d106a3d7781',
          'contractAddress': '',
          'chainName': 'Harmony',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 33,
      'nerveFlag': false,
      'usdPrice': 0.1258,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 6,
        'chain': 'Harmony',
        'nativeId': 1666700000,
        'name': 'one-1',
        'apiUrl': 'https://api.s0.pops.one/'
      }
    ]
  },
  {
    'id': 30,
    'chain': 'KCC',
    'chainName': 'KCC',
    'prefix': '0x',
    'nativeId': 322,
    'chainId': 107,
    'chainType': 2,
    'crossAddress': '0x1329d995EB0c8FD1e20fa1f9ee12e9fE4c67c60a',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/KCC.png',
    'apiUrl': 'https://rpc-testnet.kcc.network',
    'scanUrl': 'https://scan-testnet.kcc.network/',
    'psUrl': 'https://faucet-testnet.kcc.network/',
    'tokenUrl': 'https://scan-testnet.kcc.network/token/',
    'txUrl': 'https://scan-testnet.kcc.network/tx/',
    'nft': '',
    'sort': 8,
    'status': 1,
    'bridge': 1,
    'swap': 0,
    'configs': {
      'multiCallAddress': '0x0111E01E78af5608e33569Edd997Fe2f700A0721',
      'crossAddress': '0x1329d995EB0c8FD1e20fa1f9ee12e9fE4c67c60a'
    },
    'mainAsset': {
      'id': 18895,
      'chain': 'KCC',
      'registerChain': 'KCC',
      'chainId': 107,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'KCS',
      'symbol': 'KCS',
      'symbolBase': 'KCS',
      'configType': 1,
      'source': 4,
      'icon': 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/KCC.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 107,
          'heterogeneousChainMultySignAddress': '0x1329d995eb0c8fd1e20fa1f9ee12e9fe4c67c60a',
          'contractAddress': '',
          'chainName': 'KCC',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 35,
      'nerveFlag': false,
      'usdPrice': 18.0974,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 8,
        'chain': 'KCC',
        'nativeId': 322,
        'name': 'kcc-1',
        'apiUrl': 'https://rpc-testnet.kcc.network'
      }
    ]
  },
  {
    'id': 36,
    'chain': 'Cronos',
    'chainName': 'Cronos',
    'prefix': '0x',
    'nativeId': 338,
    'chainId': 109,
    'chainType': 2,
    'crossAddress': '0xb339211438Dcbf3D00d7999ad009637472FC72b3',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/cronos.png',
    'apiUrl': 'https://cronos-testnet-3.crypto.org:8545',
    'scanUrl': 'https://cronos.crypto.org/explorer/testnet3/',
    'psUrl': 'https://cronos.crypto.org/faucet',
    'tokenUrl': 'https://cronos.crypto.org/explorer/testnet3/tokens/',
    'txUrl': 'https://cronos.crypto.org/explorer/testnet3/tx/',
    'nft': '',
    'sort': 9,
    'status': 1,
    'bridge': 1,
    'swap': 0,
    'configs': {
      'multiCallAddress': '0x452085c1eD74B38169DaEe194312FA8Db4818C19',
      'crossAddress': '0xb339211438Dcbf3D00d7999ad009637472FC72b3'
    },
    'mainAsset': {
      'id': 19034,
      'chain': 'Cronos',
      'registerChain': 'Cronos',
      'chainId': 109,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'CRO',
      'symbol': 'CRO',
      'symbolBase': 'CRO',
      'configType': 1,
      'source': 4,
      'icon': 'https://files.nabox.io/icon/cronos.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 109,
          'heterogeneousChainMultySignAddress': '0xb339211438dcbf3d00d7999ad009637472fc72b3',
          'contractAddress': '',
          'chainName': 'Cronos',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 93,
      'nerveFlag': false,
      'usdPrice': 0.3889,
      'usdPlatform': null,
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 14,
        'chain': 'Cronos',
        'nativeId': 338,
        'name': 'cronos-1',
        'apiUrl': 'https://cronos-testnet-3.crypto.org:8545'
      }
    ]
  },
  {
    'id': 37,
    'chain': 'Arbitrum',
    'chainName': 'Arbitrum',
    'prefix': '0x',
    'nativeId': 421611,
    'chainId': 111,
    'chainType': 2,
    'crossAddress': '0x830befa62501F1073ebE2A519B882e358f2a0318',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Arbitrum.png',
    'apiUrl': 'https://rinkeby.arbitrum.io/rpc',
    'scanUrl': 'https://testnet.arbiscan.io/',
    'psUrl': 'https://faucets.chain.link/rinkeby',
    'tokenUrl': 'https://testnet.arbiscan.io/token/',
    'txUrl': 'https://testnet.arbiscan.io/tx/',
    'nft': '',
    'sort': 10,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xC1f4F265EC8A46ad19740E7d3c6960db4c595dE5',
      'crossAddress': '0x830befa62501F1073ebE2A519B882e358f2a0318'
    },
    'mainAsset': {
      'id': 19036,
      'chain': 'Arbitrum',
      'registerChain': 'Arbitrum',
      'chainId': 111,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'AETH',
      'symbol': 'AETH',
      'symbolBase': 'AETH',
      'configType': 1,
      'source': 4,
      'icon': 'https://files.nabox.io/icon/Arbitrum.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 111,
          'heterogeneousChainMultySignAddress': '0x830befa62501f1073ebe2a519b882e358f2a0318',
          'contractAddress': '',
          'chainName': 'Arbitrum',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 95,
      'nerveFlag': false,
      'usdPrice': 2606.8456,
      'usdPlatform': null,
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 16,
        'chain': 'Arbitrum',
        'nativeId': 421611,
        'name': 'arbitrum-1',
        'apiUrl': 'https://rinkeby.arbitrum.io/rpc'
      }
    ]
  },
  {
    'id': 38,
    'chain': 'Fantom',
    'chainName': 'Fantom',
    'prefix': '0x',
    'nativeId': 4002,
    'chainId': 112,
    'chainType': 2,
    'crossAddress': '0x830befa62501F1073ebE2A519B882e358f2a0318',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Fantom.png',
    'apiUrl': 'https://rpc.testnet.fantom.network',
    'scanUrl': 'https://testnet.ftmscan.com/',
    'psUrl': 'https://faucet.fantom.network/',
    'tokenUrl': 'https://testnet.ftmscan.com/token/',
    'txUrl': 'https://testnet.ftmscan.com/tx/',
    'nft': '',
    'sort': 11,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xC1f4F265EC8A46ad19740E7d3c6960db4c595dE5',
      'crossAddress': '0x830befa62501F1073ebE2A519B882e358f2a0318'
    },
    'mainAsset': {
      'id': 19037,
      'chain': 'Fantom',
      'registerChain': 'Fantom',
      'chainId': 112,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'FTM',
      'symbol': 'FTM',
      'symbolBase': 'FTM',
      'configType': 1,
      'source': 4,
      'icon': 'https://files.nabox.io/icon/Fantom.png',
      'nulsCross': false,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 112,
          'heterogeneousChainMultySignAddress': '0x8999d8738cc9b2e1fb1d01e1af732421d53cb2a9',
          'contractAddress': '',
          'chainName': 'Fantom',
          'token': false
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 96,
      'nerveFlag': false,
      'usdPrice': 1.2334,
      'usdPlatform': null,
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 17,
        'chain': 'Fantom',
        'nativeId': 4002,
        'name': 'fantom-1',
        'apiUrl': 'https://rpc.testnet.fantom.network'
      }
    ]
  },
  {
    'id': 22,
    'chain': 'NULS',
    'chainName': 'NULS',
    'prefix': 'tNULS',
    'nativeId': -1,
    'chainId': 2,
    'chainType': 1,
    'crossAddress': null,
    'intro': null,
    'icon': 'https://files.nabox.io/icon/NULS.png',
    'apiUrl': 'http://149.129.251.238:18004/jsonrpc',
    'scanUrl': 'http://beta.nulscan.io/',
    'psUrl': 'http://149.129.251.238:18003',
    'tokenUrl': 'http://beta.nulscan.io/token/info?contractAddress=',
    'txUrl': 'http://beta.nulscan.io/transaction/info?hash=',
    'nft': '',
    'sort': 98,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'feeAddress': 'tNULSeBaMomrBpDYJrfm49LcJ2nJKrNT5TEdam',
      'destroyAddress': 'tNULSeBaMhZnRteniCy3UZqPjTbnWKBPHX1a5d',
      'nft': ''
    },
    'mainAsset': {
      'id': 17694,
      'chain': 'NULS',
      'registerChain': 'NULS',
      'chainId': 2,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 8,
      'assetName': 'NULS',
      'symbol': 'NULS',
      'symbolBase': 'NULS',
      'configType': 1,
      'source': 7,
      'icon': 'https://files.nabox.io/icon/NULS.png',
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0xf85f03c3faac61acf7b187513aef10041029a1b2',
          'contractAddress': '0x72755f739b56ef98bda25e2622c63add229dec01',
          'chainName': 'BSC',
          'token': true
        },
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x19d90d3c8eb0c0b3e3093b054031ff1ca81704b8',
          'contractAddress': '0x74a163fcd791ec7aab2204ffabf1a1dfb8854883',
          'chainName': 'Heco',
          'token': true
        },
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xb490f2a3ec0b90e5faa1636be046d82ab7cdac74',
          'contractAddress': '0xd8eb69948e214da7fd8da6815c9945f175a4fce7',
          'chainName': 'OKExChain',
          'token': true
        },
        {
          'heterogeneousChainId': 105,
          'heterogeneousChainMultySignAddress': '0x0ea7ce4180e8bc484db4be9b497d9d106a3d7781',
          'contractAddress': '0x97893f1d41d151a9eec36d5b5a94cc3514d2c852',
          'chainName': 'Harmony',
          'token': true
        },
        {
          'heterogeneousChainId': 106,
          'heterogeneousChainMultySignAddress': '0xfe05820bae725fd093e9c1cb6e40ab3bdc40def2',
          'contractAddress': '0x97893f1d41d151a9eec36d5b5a94cc3514d2c852',
          'chainName': 'Polygon',
          'token': true
        },
        {
          'heterogeneousChainId': 107,
          'heterogeneousChainMultySignAddress': '0x1329d995eb0c8fd1e20fa1f9ee12e9fe4c67c60a',
          'contractAddress': '0x97893f1d41d151a9eec36d5b5a94cc3514d2c852',
          'chainName': 'KCC',
          'token': true
        }
      ],
      'nerveChainId': 2,
      'nerveAssetId': 1,
      'nerveFlag': false,
      'usdPrice': 0.393,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 2,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'nuls-1',
        'apiUrl': 'http://149.129.251.238:18004/jsonrpc'
      }
    ]
  },
  {
    'id': 23,
    'chain': 'NERVE',
    'chainName': 'NERVE',
    'prefix': 'TNVT',
    'nativeId': -2,
    'chainId': 5,
    'chainType': 1,
    'crossAddress': null,
    'intro': null,
    'icon': 'https://files.nabox.io/icon/NERVE.png',
    'apiUrl': 'http://beta.api.nerve.network/jsonrpc',
    'scanUrl': 'http://beta.scan.nerve.network/',
    'psUrl': 'http://beta.public.nerve.network/jsonrpc',
    'tokenUrl': '',
    'txUrl': 'http://beta.scan.nerve.network/transaction/info?hash=',
    'nft': '',
    'sort': 99,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'feeAddress': 'TNVTdTSPP9oSLvdtVSVFiUYCvXJdj1ZA1nyQU',
      'destroyAddress': 'TNVTdTSPGwjgRMtHqjmg8yKeMLnpBpVN5ZuuY',
      'nft': ''
    },
    'mainAsset': {
      'id': 17218,
      'chain': 'NERVE',
      'registerChain': 'NERVE',
      'chainId': 5,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 8,
      'assetName': 'NVT',
      'symbol': 'NVT',
      'symbolBase': 'NVT',
      'configType': 1,
      'source': 7,
      'icon': 'https://files.nabox.io/icon/NVT.png',
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 101,
          'heterogeneousChainMultySignAddress': '0x5e1cba794ad91fcd272fdaf2cd91b6110b601ed2',
          'contractAddress': '0x2cc112629954377620a20ce4fd730df8d977e6fe',
          'chainName': 'Ethereum',
          'token': true
        },
        {
          'heterogeneousChainId': 112,
          'heterogeneousChainMultySignAddress': '0x8999d8738cc9b2e1fb1d01e1af732421d53cb2a9',
          'contractAddress': '0xcea7f9f0354da1db6b649f25767412ec78c2fbf8',
          'chainName': 'Fantom',
          'token': true
        },
        {
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0xf85f03c3faac61acf7b187513aef10041029a1b2',
          'contractAddress': '0x477fe38678c166ccf0e2d6cfa755216e2a09118e',
          'chainName': 'BSC',
          'token': true
        },
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x19d90d3c8eb0c0b3e3093b054031ff1ca81704b8',
          'contractAddress': '0x3139dbe1bf7feb917cf8e978b72b6ead764b0e6c',
          'chainName': 'Heco',
          'token': true
        },
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xb490f2a3ec0b90e5faa1636be046d82ab7cdac74',
          'contractAddress': '0xf7915d4de86b856f3e51b894134816680bf09eee',
          'chainName': 'OKExChain',
          'token': true
        },
        {
          'heterogeneousChainId': 105,
          'heterogeneousChainMultySignAddress': '0x0ea7ce4180e8bc484db4be9b497d9d106a3d7781',
          'contractAddress': '0xcea7f9f0354da1db6b649f25767412ec78c2fbf8',
          'chainName': 'Harmony',
          'token': true
        },
        {
          'heterogeneousChainId': 106,
          'heterogeneousChainMultySignAddress': '0xfe05820bae725fd093e9c1cb6e40ab3bdc40def2',
          'contractAddress': '0xcea7f9f0354da1db6b649f25767412ec78c2fbf8',
          'chainName': 'Polygon',
          'token': true
        },
        {
          'heterogeneousChainId': 107,
          'heterogeneousChainMultySignAddress': '0x1329d995eb0c8fd1e20fa1f9ee12e9fe4c67c60a',
          'contractAddress': '0xcea7f9f0354da1db6b649f25767412ec78c2fbf8',
          'chainName': 'KCC',
          'token': true
        },
        {
          'heterogeneousChainId': 108,
          'heterogeneousChainMultySignAddress': 'TYVxuksybZdbyQwoR25V2YUgXYAHikcLro',
          'contractAddress': 'TYMQT8152SicTSDuNEob6t6QRLfet1xrMn',
          'chainName': 'TRX',
          'token': true
        },
        {
          'heterogeneousChainId': 109,
          'heterogeneousChainMultySignAddress': '0xb339211438dcbf3d00d7999ad009637472fc72b3',
          'contractAddress': '0xcea7f9f0354da1db6b649f25767412ec78c2fbf8',
          'chainName': 'Cronos',
          'token': true
        },
        {
          'heterogeneousChainId': 110,
          'heterogeneousChainMultySignAddress': '0x8999d8738cc9b2e1fb1d01e1af732421d53cb2a9',
          'contractAddress': '0xcea7f9f0354da1db6b649f25767412ec78c2fbf8',
          'chainName': 'Avalanche',
          'token': true
        },
        {
          'heterogeneousChainId': 111,
          'heterogeneousChainMultySignAddress': '0x830befa62501f1073ebe2a519b882e358f2a0318',
          'contractAddress': '0xcea7f9f0354da1db6b649f25767412ec78c2fbf8',
          'chainName': 'Arbitrum',
          'token': true
        }
      ],
      'nerveChainId': 5,
      'nerveAssetId': 1,
      'nerveFlag': false,
      'usdPrice': 0.0213,
      'usdPlatform': 'feixiaohao',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 1,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'nvt-1',
        'apiUrl': 'http://beta.api.nerve.network/jsonrpc'
      }
    ]
  }
];
