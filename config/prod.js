// 主网
export const IS_DEV = process.env.NODE_ENV === 'development';
// 当前网络
export const currentNet = 'mainnet';

// ChainId和资产ID
export const MAIN_INFO = { chainId: 9, assetId: 1, prefix: 'NERVE', symbol: 'NVT', decimal: 8, rpc: 'https://public.nerve.network', batchRPC: 'https://api.nerve.network/jsonrpc' };
export const NULS_INFO = { chainId: 1, assetId: 1, prefix: 'NULS', symbol: 'NULS', decimal: 8, rpc: 'https://public1.nuls.io', batchRPC: 'https://api.nuls.io/jsonrpc' };

// ETH 网络信息 测试网:ropsten, 主网:homestead
export const ETHNET = 'homestead';

export const SWAP_BOX_API_URL = IS_DEV ? '/nabox-api' : 'https://api.v2.nabox.io/nabox-api'; // Prod

export const TRON_MULTI_CALL_ADDRESS = 'TCNYd8L5hBey9FwPpvgtvDaY2cHjMFVLZu';

export const TRON_TRX_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';

export const trxWithdrawFee = '40000000';

export const localChainConfig = [
  {
    'id': 3,
    'chain': 'Ethereum',
    'chainName': 'Ethereum',
    'prefix': '0x',
    'nativeId': 1,
    'chainId': 101,
    'chainType': 2,
    'crossAddress': '0xc707e0854da2d72c90a7453f8dc224dd937d7e82',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Ethereum.png',
    'apiUrl': 'https://geth.nerve.network/',
    'scanUrl': 'https://etherscan.io/',
    'psUrl': null,
    'tokenUrl': 'https://etherscan.io/token/',
    'txUrl': 'https://etherscan.io/tx/',
    'nft': 'eth',
    'sort': 1,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0x6899aa135037a4c8a3cab11622d35cea4cd63747',
      'crossAddress': '0xc707e0854da2d72c90a7453f8dc224dd937d7e82'
    },
    'mainAsset': {
      'id': 18684,
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
          'heterogeneousChainMultySignAddress': '0xc707e0854da2d72c90a7453f8dc224dd937d7e82',
          'contractAddress': '',
          'chainName': 'Ethereum',
          'token': false
        },
        {
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0x75ab1d50bedbd32b6113941fcf5359787a4bbef4',
          'contractAddress': '0x3095666bb0393f7ea894050129cf2741c83547ca',
          'chainName': 'BSC',
          'token': true
        },
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x2ead2e7a3bd88c6a90b3d464bc6938ba56f1407f',
          'contractAddress': '0x8cd6e29d3686d24d3c2018cee54621ea0f89313b',
          'chainName': 'Heco',
          'token': true
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 2,
      'nerveFlag': false,
      'usdPrice': 2604.9417,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 27,
        'chain': 'Ethereum',
        'nativeId': 1,
        'name': 'ETH-1',
        'apiUrl': 'https://geth.nerve.network'
      },
      {
        'id': 28,
        'chain': 'Ethereum',
        'nativeId': 1,
        'name': 'ETH-2',
        'apiUrl': 'https://web3.mytokenpocket.vip'
      },
      {
        'id': 29,
        'chain': 'Ethereum',
        'nativeId': 1,
        'name': 'ETH-3',
        'apiUrl': 'https://geth.mytokenpocket.vip'
      },
      {
        'id': 30,
        'chain': 'Ethereum',
        'nativeId': 1,
        'name': 'ETH-4',
        'apiUrl': 'https://eth626892d.jccdex.cn'
      }
    ]
  },
  {
    'id': 4,
    'chain': 'BSC',
    'chainName': 'BSC',
    'prefix': '0x',
    'nativeId': 56,
    'chainId': 102,
    'chainType': 2,
    'crossAddress': '0x75ab1d50bedbd32b6113941fcf5359787a4bbef4',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/BSC.png',
    'apiUrl': 'https://bsc-dataseed.binance.org',
    'scanUrl': 'https://bscscan.com/',
    'psUrl': null,
    'tokenUrl': 'https://bscscan.com/token/',
    'txUrl': 'https://bscscan.com/tx/',
    'nft': 'bsc',
    'sort': 2,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0x07616A4fb60F854054137A7b9b5C3f8c8dd2dc01',
      'crossAddress': '0x75ab1d50bedbd32b6113941fcf5359787a4bbef4'
    },
    'mainAsset': {
      'id': 18989,
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
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0x75ab1d50bedbd32b6113941fcf5359787a4bbef4',
          'contractAddress': '',
          'chainName': 'BSC',
          'token': false
        },
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xe096d12d6cb61e11bce3755f938b9259b386523a',
          'contractAddress': '0x7ed729f4d6838bb775601886823476f0dd64c3ae',
          'chainName': 'OKExChain',
          'token': true
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 25,
      'nerveFlag': false,
      'usdPrice': 372.1665,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 31,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'BSC-1',
        'apiUrl': 'https://bsc-dataseed4.ninicoin.io'
      },
      {
        'id': 32,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'BSC-2',
        'apiUrl': 'https://bsc-dataseed1.binance.org'
      },
      {
        'id': 33,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'BSC-3',
        'apiUrl': 'https://bsc-dataseed2.binance.org'
      },
      {
        'id': 34,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'BSC-4',
        'apiUrl': 'https://bsc-dataseed3.binance.org'
      },
      {
        'id': 35,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'BSC-5',
        'apiUrl': 'https://bsc-dataseed.binance.org'
      },
      {
        'id': 51,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'bsc-6',
        'apiUrl': 'https://bsc-dataseed3.defibit.io'
      },
      {
        'id': 52,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'bsc-7',
        'apiUrl': 'https://bsc-dataseed4.defibit.io'
      },
      {
        'id': 53,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'bsc-8',
        'apiUrl': 'https://bsc-dataseed2.ninicoin.io'
      },
      {
        'id': 54,
        'chain': 'BSC',
        'nativeId': 56,
        'name': 'bsc-9',
        'apiUrl': 'https://bsc-dataseed3.ninicoin.io'
      }
    ]
  },
  {
    'id': 8,
    'chain': 'Polygon',
    'chainName': 'Polygon',
    'prefix': '0x',
    'nativeId': 137,
    'chainId': 106,
    'chainType': 2,
    'crossAddress': '0x9ddc2fb726cf243305349587ae2a33dd7c91460e',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Polygon.png',
    'apiUrl': 'https://matic-mainnet.chainstacklabs.com',
    'scanUrl': 'https://polygonscan.com/',
    'psUrl': null,
    'tokenUrl': 'https://polygonscan.com/token/',
    'txUrl': 'https://polygonscan.com/tx/',
    'nft': 'matic',
    'sort': 3,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xd1F3BE686D64e1EA33fcF64980b65847aA43D79C',
      'crossAddress': '0x9ddc2fb726cf243305349587ae2a33dd7c91460e'
    },
    'mainAsset': {
      'id': 1360884,
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
          'heterogeneousChainMultySignAddress': '0x9ddc2fb726cf243305349587ae2a33dd7c91460e',
          'contractAddress': '',
          'chainName': 'Polygon',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 160,
      'nerveFlag': false,
      'usdPrice': 1.434,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 40,
        'chain': 'Polygon',
        'nativeId': 137,
        'name': 'MATIC-1',
        'apiUrl': 'https://rpc-mainnet.matic.network'
      },
      {
        'id': 41,
        'chain': 'Polygon',
        'nativeId': 137,
        'name': 'MATIC-2',
        'apiUrl': 'https://matic-mainnet.chainstacklabs.com'
      },
      {
        'id': 42,
        'chain': 'Polygon',
        'nativeId': 137,
        'name': 'MATIC-3',
        'apiUrl': 'https://rpc-mainnet.maticvigil.com'
      },
      {
        'id': 43,
        'chain': 'Polygon',
        'nativeId': 137,
        'name': 'MATIC-4',
        'apiUrl': 'https://polygon-rpc.com'
      },
      {
        'id': 44,
        'chain': 'Polygon',
        'nativeId': 137,
        'name': 'MATIC-5',
        'apiUrl': 'https://matic-mainnet-archive-rpc.bwarelabs.com'
      }
    ]
  },
  {
    'id': 5,
    'chain': 'Heco',
    'chainName': 'Heco',
    'prefix': '0x',
    'nativeId': 128,
    'chainId': 103,
    'chainType': 2,
    'crossAddress': '0x2ead2e7a3bd88c6a90b3d464bc6938ba56f1407f',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Heco.png',
    'apiUrl': 'https://http-mainnet.hecochain.com',
    'scanUrl': 'https://hecoinfo.com/',
    'psUrl': null,
    'tokenUrl': 'https://hecoinfo.com/token/',
    'txUrl': 'https://hecoinfo.com/tx/',
    'nft': '',
    'sort': 4,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xd1F3BE686D64e1EA33fcF64980b65847aA43D79C',
      'crossAddress': '0x2ead2e7a3bd88c6a90b3d464bc6938ba56f1407f'
    },
    'mainAsset': {
      'id': 19090,
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
      'source': 9,
      'icon': 'https://files.nabox.io/icon/HT.png',
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x2ead2e7a3bd88c6a90b3d464bc6938ba56f1407f',
          'contractAddress': '',
          'chainName': 'Heco',
          'token': false
        },
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xe096d12d6cb61e11bce3755f938b9259b386523a',
          'contractAddress': '0xe0ff125e74d8a9afdc495ede8cc0044a78ee84c3',
          'chainName': 'OKExChain',
          'token': true
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 55,
      'nerveFlag': false,
      'usdPrice': 8.3726,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 36,
        'chain': 'Heco',
        'nativeId': 128,
        'name': 'HECO-1',
        'apiUrl': 'https://http-mainnet.hecochain.com'
      },
      {
        'id': 37,
        'chain': 'Heco',
        'nativeId': 128,
        'name': 'HECO-2',
        'apiUrl': 'https://http-mainnet-node.defibox.com'
      }
    ]
  },
  {
    'id': 6,
    'chain': 'OKExChain',
    'chainName': 'OKExChain',
    'prefix': '0x',
    'nativeId': 66,
    'chainId': 104,
    'chainType': 2,
    'crossAddress': '0xe096d12d6cb61e11bce3755f938b9259b386523a',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/OKExChain.png',
    'apiUrl': 'https://exchainrpc.okex.org',
    'scanUrl': 'https://www.oklink.com/',
    'psUrl': null,
    'tokenUrl': 'https://www.oklink.com/okexchain/tokenAddr/',
    'txUrl': 'https://www.oklink.com/okexchain/tx/',
    'nft': '',
    'sort': 5,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xd1F3BE686D64e1EA33fcF64980b65847aA43D79C',
      'crossAddress': '0xe096d12d6cb61e11bce3755f938b9259b386523a'
    },
    'mainAsset': {
      'id': 862100,
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
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xe096d12d6cb61e11bce3755f938b9259b386523a',
          'contractAddress': '',
          'chainName': 'OKExChain',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 87,
      'nerveFlag': false,
      'usdPrice': 34.3658,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 38,
        'chain': 'OKExChain',
        'nativeId': 66,
        'name': 'OEC-1',
        'apiUrl': 'https://exchainrpc.okex.org'
      },
      {
        'id': 39,
        'chain': 'OKExChain',
        'nativeId': 66,
        'name': 'OEC-2',
        'apiUrl': 'https://okchain.mytokenpocket.vip'
      }
    ]
  },
  {
    'id': 15,
    'chain': 'Avalanche',
    'chainName': 'Avalanche',
    'prefix': '0x',
    'nativeId': 43114,
    'chainId': 110,
    'chainType': 2,
    'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/AVAX.png',
    'apiUrl': 'https://api.avax.network/ext/bc/C/rpc',
    'scanUrl': 'https://snowtrace.io/',
    'psUrl': '',
    'tokenUrl': 'https://snowtrace.io/token/',
    'txUrl': 'https://snowtrace.io/tx/',
    'nft': '',
    'sort': 6,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xea749848faf37383e48a3004074b327229345943',
      'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5'
    },
    'mainAsset': {
      'id': 1364210,
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
          'heterogeneousChainMultySignAddress': '0x3758aa66cad9f2606f1f501c9cb31b94b713a6d5',
          'contractAddress': '',
          'chainName': 'Avalanche',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 267,
      'nerveFlag': false,
      'usdPrice': 73.7129,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': []
  },
  {
    'id': 7,
    'chain': 'Harmony',
    'chainName': 'Harmony',
    'prefix': '0x',
    'nativeId': 1666600000,
    'chainId': 105,
    'chainType': 2,
    'crossAddress': '0x32fae32961474e6d19b7a6346524b8a6a6fd1d9c',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Harmony.png',
    'apiUrl': 'https://api.harmony.one/',
    'scanUrl': 'https://explorer.harmony.one/',
    'psUrl': null,
    'tokenUrl': 'https://explorer.harmony.one/address/',
    'txUrl': 'https://explorer.harmony.one/tx/',
    'nft': '',
    'sort': 7,
    'status': 1,
    'bridge': 1,
    'swap': 0,
    'configs': {
      'multiCallAddress': '0xd1F3BE686D64e1EA33fcF64980b65847aA43D79C',
      'crossAddress': '0x32fae32961474e6d19b7a6346524b8a6a6fd1d9c'
    },
    'mainAsset': {
      'id': 1360883,
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
          'heterogeneousChainMultySignAddress': '0x32fae32961474e6d19b7a6346524b8a6a6fd1d9c',
          'contractAddress': '',
          'chainName': 'Harmony',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 159,
      'nerveFlag': false,
      'usdPrice': 0.1259,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 45,
        'chain': 'Harmony',
        'nativeId': 1666600000,
        'name': 'ONE-1',
        'apiUrl': 'https://api.harmony.one/'
      }
    ]
  },
  {
    'id': 9,
    'chain': 'KCC',
    'chainName': 'KCC',
    'prefix': '0x',
    'nativeId': 321,
    'chainId': 107,
    'chainType': 2,
    'crossAddress': '0xdb442dff8ff9fd10245406da9a32528c30c10c92',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/KCC.png',
    'apiUrl': 'https://rpc-mainnet.kcc.network',
    'scanUrl': 'https://explorer.kcc.io/cn/',
    'psUrl': null,
    'tokenUrl': 'https://explorer.kcc.io/cn/token/',
    'txUrl': 'https://explorer.kcc.io/cn/tx/',
    'nft': '',
    'sort': 8,
    'status': 1,
    'bridge': 1,
    'swap': 0,
    'configs': {
      'multiCallAddress': '0xd1F3BE686D64e1EA33fcF64980b65847aA43D79C',
      'crossAddress': '0xdb442dff8ff9fd10245406da9a32528c30c10c92'
    },
    'mainAsset': {
      'id': 1360885,
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
          'heterogeneousChainMultySignAddress': '0xdb442dff8ff9fd10245406da9a32528c30c10c92',
          'contractAddress': '',
          'chainName': 'KCC',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 161,
      'nerveFlag': false,
      'usdPrice': 18.0826,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 46,
        'chain': 'KCC',
        'nativeId': 321,
        'name': 'KCC-1',
        'apiUrl': 'https://rpc-mainnet.kcc.network'
      }
    ]
  },
  {
    'id': 14,
    'chain': 'Cronos',
    'chainName': 'Cronos',
    'prefix': '0x',
    'nativeId': 25,
    'chainId': 109,
    'chainType': 2,
    'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/cronos.png',
    'apiUrl': 'https://evm-cronos.crypto.org',
    'scanUrl': 'https://cronos.crypto.org/explorer/',
    'psUrl': '',
    'tokenUrl': 'https://cronos.crypto.org/explorer/token/',
    'txUrl': 'https://cronos.crypto.org/explorer/tx/',
    'nft': '',
    'sort': 9,
    'status': 1,
    'bridge': 1,
    'swap': 0,
    'configs': {
      'multiCallAddress': '0x51E54e092B93FE31FC277435B1380512D7d27eEe',
      'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5'
    },
    'mainAsset': {
      'id': 1364209,
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
          'heterogeneousChainMultySignAddress': '0x3758aa66cad9f2606f1f501c9cb31b94b713a6d5',
          'contractAddress': '',
          'chainName': 'Cronos',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 266,
      'nerveFlag': false,
      'usdPrice': 0.3887,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 56,
        'chain': 'Cronos',
        'nativeId': 25,
        'name': 'cronos-1',
        'apiUrl': 'https://evm-cronos.crypto.org'
      }
    ]
  },
  {
    'id': 16,
    'chain': 'Arbitrum',
    'chainName': 'Arbitrum',
    'prefix': '0x',
    'nativeId': 42161,
    'chainId': 111,
    'chainType': 2,
    'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Arbitrum.png',
    'apiUrl': 'https://arb1.arbitrum.io/rpc',
    'scanUrl': 'https://arbiscan.io/',
    'psUrl': '',
    'tokenUrl': 'https://arbiscan.io/token/',
    'txUrl': 'https://arbiscan.io/tx/',
    'nft': '',
    'sort': 10,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xea749848faF37383e48A3004074b327229345943',
      'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5'
    },
    'mainAsset': {
      'id': 1364211,
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
          'heterogeneousChainMultySignAddress': '0xf0e406c49c63abf358030a299c0e00118c4c6ba5',
          'contractAddress': '',
          'chainName': 'Arbitrum',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 268,
      'nerveFlag': false,
      'usdPrice': 2604.9417,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': []
  },
  {
    'id': 17,
    'chain': 'Fantom',
    'chainName': 'Fantom',
    'prefix': '0x',
    'nativeId': 250,
    'chainId': 112,
    'chainType': 2,
    'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/Fantom.png',
    'apiUrl': 'https://rpc.ftm.tools/',
    'scanUrl': 'https://ftmscan.com/',
    'psUrl': 'https://faucet.fantom.network/',
    'tokenUrl': 'https://ftmscan.com/token/',
    'txUrl': 'https://ftmscan.com/tx/',
    'nft': '',
    'sort': 11,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'multiCallAddress': '0xea749848faF37383e48A3004074b327229345943',
      'crossAddress': '0x3758AA66caD9F2606F1F501c9CB31b94b713A6d5'
    },
    'mainAsset': {
      'id': 1364212,
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
          'heterogeneousChainMultySignAddress': '0x3758aa66cad9f2606f1f501c9cb31b94b713a6d5',
          'contractAddress': '',
          'chainName': 'Fantom',
          'token': false
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 269,
      'nerveFlag': false,
      'usdPrice': 1.2333,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': []
  },
  {
    'id': 19,
    'chain': 'CSC',
    'chainName': 'CSC',
    'prefix': '0x',
    'nativeId': 52,
    'chainId': 0,
    'chainType': 2,
    'crossAddress': '',
    'intro': null,
    'icon': 'https://files.nabox.io/icon/CoinEx.jpeg',
    'apiUrl': 'https://rpc.coinex.net/',
    'scanUrl': 'https://www.coinex.net/',
    'psUrl': '',
    'tokenUrl': 'https://www.coinex.net/token/',
    'txUrl': 'https://www.coinex.net/tx/',
    'nft': '',
    'sort': 12,
    'status': 1,
    'bridge': 0,
    'swap': 0,
    'configs': {
      'multiCallAddress': '0xC1f4F265EC8A46ad19740E7d3c6960db4c595dE5',
      'crossAddress': ''
    },
    'mainAsset': {
      'id': 1364380,
      'chain': 'CSC',
      'registerChain': 'CSC',
      'chainId': 0,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 18,
      'assetName': 'CET',
      'symbol': 'CET',
      'symbolBase': 'CET',
      'configType': 1,
      'source': 0,
      'icon': 'https://files.nabox.io/icon/CoinEx.jpeg',
      'nulsCross': false,
      'heterogeneousList': null,
      'nerveChainId': 0,
      'nerveAssetId': 0,
      'nerveFlag': false,
      'usdPrice': 1.0,
      'usdPlatform': null,
      'usdUrl': null
    },
    'assets': [],
    'urlList': []
  },
  {
    'id': 1,
    'chain': 'NULS',
    'chainName': 'NULS',
    'prefix': 'NULS',
    'nativeId': -1,
    'chainId': 1,
    'chainType': 1,
    'crossAddress': null,
    'intro': '',
    'icon': 'https://files.nabox.io/icon/NULS.png',
    'apiUrl': 'https://api.nuls.io/jsonrpc',
    'scanUrl': 'https://nulscan.io/',
    'psUrl': 'https://public1.nuls.io/',
    'tokenUrl': 'https://nulscan.io/token/info?contractAddress=',
    'txUrl': 'https://nulscan.io/transaction/info?hash=',
    'nft': '',
    'sort': 98,
    'status': 1,
    'bridge': 1,
    'swap': 0,
    'configs': {
      'feeAddress': 'NULSd6HgceXmdyqnK5WzHdJKjXxtZVR3w3rJp',
      'destroyAddress': 'NULSd6HgWSU1iR6BfNoQi85mAMT52JMFzpnok',
      'nft': ''
    },
    'mainAsset': {
      'id': 18505,
      'chain': 'NULS',
      'registerChain': 'NULS',
      'chainId': 1,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 8,
      'assetName': 'NULS',
      'symbol': 'NULS',
      'symbolBase': 'NULS',
      'configType': 1,
      'source': 7,
      'icon': 'https://files.nabox.io/icon/2021_NULS_ICON_Tra-01.png',
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 101,
          'heterogeneousChainMultySignAddress': '0xc707e0854da2d72c90a7453f8dc224dd937d7e82',
          'contractAddress': '0xa2791bdf2d5055cda4d46ec17f9f429568275047',
          'chainName': 'Ethereum',
          'token': true
        },
        {
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0x75ab1d50bedbd32b6113941fcf5359787a4bbef4',
          'contractAddress': '0x8cd6e29d3686d24d3c2018cee54621ea0f89313b',
          'chainName': 'BSC',
          'token': true
        },
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x2ead2e7a3bd88c6a90b3d464bc6938ba56f1407f',
          'contractAddress': '0xd938e45680da19ad36646ae8d4c671b2b1270f39',
          'chainName': 'Heco',
          'token': true
        },
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xe096d12d6cb61e11bce3755f938b9259b386523a',
          'contractAddress': '0x8cd6e29d3686d24d3c2018cee54621ea0f89313b',
          'chainName': 'OKExChain',
          'token': true
        },
        {
          'heterogeneousChainId': 105,
          'heterogeneousChainMultySignAddress': '0x32fae32961474e6d19b7a6346524b8a6a6fd1d9c',
          'contractAddress': '0x8b8e48a8cc52389cd16a162e5d8bd514fabf4ba0',
          'chainName': 'Harmony',
          'token': true
        },
        {
          'heterogeneousChainId': 106,
          'heterogeneousChainMultySignAddress': '0x9ddc2fb726cf243305349587ae2a33dd7c91460e',
          'contractAddress': '0x8b8e48a8cc52389cd16a162e5d8bd514fabf4ba0',
          'chainName': 'Polygon',
          'token': true
        },
        {
          'heterogeneousChainId': 107,
          'heterogeneousChainMultySignAddress': '0xdb442dff8ff9fd10245406da9a32528c30c10c92',
          'contractAddress': '0x8b8e48a8cc52389cd16a162e5d8bd514fabf4ba0',
          'chainName': 'KCC',
          'token': true
        }
      ],
      'nerveChainId': 1,
      'nerveAssetId': 1,
      'nerveFlag': true,
      'usdPrice': 0.3932,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 10,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'NULS-1',
        'apiUrl': 'https://api.nuls.io/jsonrpc'
      },
      {
        'id': 11,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'NULS-2',
        'apiUrl': 'https://sg.api.nuls.io/jsonrpc'
      },
      {
        'id': 12,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'NULS-3',
        'apiUrl': 'https://hk.api.nuls.io/jsonrpc'
      },
      {
        'id': 13,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'NULS-4',
        'apiUrl': 'https://au.api.nuls.io/jsonrpc'
      },
      {
        'id': 14,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'NULS-5',
        'apiUrl': 'https://us.api.nuls.io/jsonrpc '
      },
      {
        'id': 15,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'NULS-6',
        'apiUrl': 'https://id.api.nuls.io/jsonrpc'
      },
      {
        'id': 16,
        'chain': 'NULS',
        'nativeId': -1,
        'name': 'NULS-7',
        'apiUrl': 'http://in.api.nuls.io/jsonrpc'
      }
    ]
  },
  {
    'id': 2,
    'chain': 'NERVE',
    'chainName': 'NERVE',
    'prefix': 'NERVE',
    'nativeId': -2,
    'chainId': 9,
    'chainType': 1,
    'crossAddress': null,
    'intro': null,
    'icon': 'https://files.nabox.io/icon/NERVE.png',
    'apiUrl': 'https://api.nerve.network/jsonrpc',
    'scanUrl': 'https://scan.nerve.network/',
    'psUrl': 'https://public.nerve.network/jsonrpc',
    'tokenUrl': '',
    'txUrl': 'https://scan.nerve.network/transaction/info?hash=',
    'nft': '',
    'sort': 99,
    'status': 1,
    'bridge': 1,
    'swap': 1,
    'configs': {
      'feeAddress': 'NERVEepb69f573sRzfoTX9Kn67WeNtXhG6Y6W8',
      'destroyAddress': 'NERVEepb63T1M8JgQ26jwZpZXYL8ZMLdUAK31L',
      'nft': ''
    },
    'mainAsset': {
      'id': 18683,
      'chain': 'NERVE',
      'registerChain': 'NERVE',
      'chainId': 9,
      'assetId': 1,
      'contractAddress': '',
      'decimals': 8,
      'assetName': 'NVT',
      'symbol': 'NVT',
      'symbolBase': 'NVT',
      'configType': 1,
      'source': 7,
      'icon': 'https://files.nabox.io/icon/Logo-white.png',
      'nulsCross': true,
      'heterogeneousList': [
        {
          'heterogeneousChainId': 101,
          'heterogeneousChainMultySignAddress': '0xc707e0854da2d72c90a7453f8dc224dd937d7e82',
          'contractAddress': '0x7b6f71c8b123b38aa8099e0098bec7fbc35b8a13',
          'chainName': 'Ethereum',
          'token': true
        },
        {
          'heterogeneousChainId': 102,
          'heterogeneousChainMultySignAddress': '0x75ab1d50bedbd32b6113941fcf5359787a4bbef4',
          'contractAddress': '0xf0e406c49c63abf358030a299c0e00118c4c6ba5',
          'chainName': 'BSC',
          'token': true
        },
        {
          'heterogeneousChainId': 103,
          'heterogeneousChainMultySignAddress': '0x2ead2e7a3bd88c6a90b3d464bc6938ba56f1407f',
          'contractAddress': '0xf0e406c49c63abf358030a299c0e00118c4c6ba5',
          'chainName': 'Heco',
          'token': true
        },
        {
          'heterogeneousChainId': 104,
          'heterogeneousChainMultySignAddress': '0xe096d12d6cb61e11bce3755f938b9259b386523a',
          'contractAddress': '0xd1351ec15e8511658c2ba1e1e81e1e60aa39c9cd',
          'chainName': 'OKExChain',
          'token': true
        },
        {
          'heterogeneousChainId': 105,
          'heterogeneousChainMultySignAddress': '0x32fae32961474e6d19b7a6346524b8a6a6fd1d9c',
          'contractAddress': '0x0fdb676775cc91042501c0c14ae5b2b5166b24d9',
          'chainName': 'Harmony',
          'token': true
        },
        {
          'heterogeneousChainId': 106,
          'heterogeneousChainMultySignAddress': '0x9ddc2fb726cf243305349587ae2a33dd7c91460e',
          'contractAddress': '0x0fdb676775cc91042501c0c14ae5b2b5166b24d9',
          'chainName': 'Polygon',
          'token': true
        },
        {
          'heterogeneousChainId': 107,
          'heterogeneousChainMultySignAddress': '0xdb442dff8ff9fd10245406da9a32528c30c10c92',
          'contractAddress': '0x0fdb676775cc91042501c0c14ae5b2b5166b24d9',
          'chainName': 'KCC',
          'token': true
        },
        {
          'heterogeneousChainId': 109,
          'heterogeneousChainMultySignAddress': '0x3758aa66cad9f2606f1f501c9cb31b94b713a6d5',
          'contractAddress': '0x0fdb676775cc91042501c0c14ae5b2b5166b24d9',
          'chainName': 'Cronos',
          'token': true
        },
        {
          'heterogeneousChainId': 110,
          'heterogeneousChainMultySignAddress': '0x3758aa66cad9f2606f1f501c9cb31b94b713a6d5',
          'contractAddress': '0x0fdb676775cc91042501c0c14ae5b2b5166b24d9',
          'chainName': 'Avalanche',
          'token': true
        }
      ],
      'nerveChainId': 9,
      'nerveAssetId': 1,
      'nerveFlag': false,
      'usdPrice': 0.0213,
      'usdPlatform': 'cmc',
      'usdUrl': null
    },
    'assets': [],
    'urlList': [
      {
        'id': 17,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'NVT-1',
        'apiUrl': 'https://api.nerve.network/jsonrpc'
      },
      {
        'id': 18,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'NVT-2',
        'apiUrl': 'https://sg.api.nerve.network/jsonrpc'
      },
      {
        'id': 19,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'NVT-3',
        'apiUrl': 'https://hk.api.nerve.network/jsonrpc'
      },
      {
        'id': 20,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'NVT-4',
        'apiUrl': 'https://us.api.nerve.network/jsonrpc'
      },
      {
        'id': 21,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'NVT-5',
        'apiUrl': 'https://au.api.nerve.network/jsonrpc'
      },
      {
        'id': 22,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'NVT-6',
        'apiUrl': 'https://id.api.nerve.network/jsonrpc'
      },
      {
        'id': 23,
        'chain': 'NERVE',
        'nativeId': -2,
        'name': 'NVT-7',
        'apiUrl': 'http://in.api.nerve.network/jsonrpc'
      }
    ]
  }
];

