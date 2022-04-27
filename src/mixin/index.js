import {
  superLong,
  divisionDecimals,
  tofix,
  numberFormat,
  getCurrentAccount,
  getCurrentAccountIndex,
  TRON
} from '@/api/util';
import moment from 'moment';
import { Division, Minus } from '@/api/util';
import { ETransfer } from '@/api/api';
import { MAIN_INFO, NULS_INFO } from '@/config';
import TronLink from '@/api/tronLink';

export default {
  data() {
    return {};
  },
  computed: {
    currentAccount() {
      return this.$store.getters.currentAccount;
    },
    nerveAddress() {
      return this.currentAccount && this.currentAccount.address['NERVE'];
    },
    fromAddress() {
      return this.$store.state.fromAddress;
    },
    fromNetwork() {
      return this.$store.state.network;
    },
    isDapp() {
      return this.$store.state.isDapp;
    },
    showConnect() {
      return this.$store.state.showConnect;
    },
    showSign() {
      return this.$store.state.showSign;
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    },
    // 1:NULS系 2:以太坊系列 3:TRON
    chainType() {
      const network = this.$store.state.network;
      const chainConfig = JSON.parse(sessionStorage.getItem('config'));
      return chainConfig[network] && chainConfig[network]['chainType'];
    }
  },
  filters: {
    numFormat(val) {
      if (!val) return 0;
      const tempNum = val.toString();
      const int = tempNum.split('.')[0];
      const float = tempNum.split('.')[1] || '';
      const intPart = Number(int).toFixed(0); // 获取整数部分
      return intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (float ? '.' + float : '');
    },
    numFormatFix(val) {
      if (!val) return 0;
      const tempNum = tofix(val.toString(), 2, -1);
      const int = tempNum.split('.')[0];
      const float = tempNum.split('.')[1] || '';
      const intPart = Number(int).toFixed(0); // 获取整数部分
      return intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (float ? '.' + float : '');
    },
    numFormatFixSix(val) {
      if (!val) return 0;
      const tempNum = numberFormat(tofix(val.toString(), 6, -1), 6);
      const int = tempNum.split('.')[0];
      const float = tempNum.split('.')[1] || '';
      const intPart = Number(int).toFixed(0); // 获取整数部分
      return intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (float ? '.' + float : '');
    },
    timeFormat(val) {
      if (!val) return '';
      const times = +new Date(val);
      return moment(times).format('MM/DD HH:mm');
    },
    numberFormat(val) {
      if (!Number(val)) return 0;
      const numberVal = Number(val);
      const n = 6;
      if (n <= 0) return Math.round(numberVal);
      return Math.round(numberVal * Math.pow(10, n)) / Math.pow(10, n);
    },
    numberFormatLetter(val) {
      const k = Math.pow(10, 3);
      const m = Math.pow(10, 6);
      if (Minus(val, k) < 0) {
        return numberFormat(tofix(val, 2, -1), 2);
      } else if (Minus(val, k) >= 0 && Minus(val, m) < 0) {
        return `${numberFormat(tofix(Division(val, k), 2, -1), 2)}K`;
      } else if (Minus(val, m) > 0) {
        return `${numberFormat(tofix(Division(val, m), 2, -1), 2)}M`;
      } else {
        return '0';
      }
    }
  },
  methods: {
    getPicture(suffix) {
      const baseUrl = 'https://files.nabox.io/icon/';
      return `${baseUrl}${suffix}.png`;
    },
    pictureError(e) {
      e.target.src = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULL.png';
    },
    superLong(str, len = 5) {
      return superLong(str, len);
    },
    formatTime(time, isTime = true) {
      const date = new Date(isTime ? time.replace(/-/g, '/') : time); // 兼容iOS
      const months = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      return `${months}/${day} ${hours}:${minutes}`;
    },
    numberFormat(val, float, returnBoo = false) {
      if (!Number(val)) {
        if (returnBoo) {
          return '';
        }
        return '0';
      }
      const numberVal = Number(val);
      const n = float || 6;
      if (n <= 0) return Math.round(numberVal);
      return (Math.round(numberVal * Math.pow(10, n)) / Math.pow(10, n)).toString();
    },
    // 获取NERVE上面的资产信息
    async getNerveAssetBalance(assetInfo) {
      const { chainId, assetId, contractAddress, decimals } = assetInfo;
      const tempParams = [{
        chainId,
        assetId,
        contractAddress
      }];
      const params = [MAIN_INFO.chainId, this.currentAccount['address']['NERVE'], tempParams];
      const url = MAIN_INFO.batchRPC;
      const res = await this.$post(url, 'getBalanceList', params);
      if (res.result && res.result.length !== 0) {
        const tempAsset = res.result[0];
        return divisionDecimals(tempAsset.balance, decimals);
      } else {
        return 0;
      }
    },
    // 获取异构连上面的资产余额
    async getHeterogeneousAssetBalance(assetInfo) {
      const transfer = new ETransfer({
        chain: this.fromNetwork
      });
      const { contractAddress, decimals } = assetInfo;
      if (assetInfo.contractAddress) {
        return await transfer.getERC20Balance(contractAddress, decimals, this.fromAddress);
      } else {
        return await transfer.getEthBalance(this.fromAddress);
      }
    },
    setTRONAddress(address, TRONAddress) {
      const currentAccount = getCurrentAccount(address);
      const tempIndex = getCurrentAccountIndex(address);
      const accountList = JSON.parse(localStorage.getItem('accountList'));
      currentAccount['address']['TRON'] = TRONAddress;
      accountList[tempIndex] = currentAccount;
      localStorage.setItem('accountList', JSON.stringify(accountList));
    },
    async getTronAssetBalance(assetInfo) {
      const { contractAddress, decimals } = assetInfo;
      const tron = new TronLink();
      if (contractAddress) {
        return await tron.getTrc20Balance(this.currentAccount['address'][TRON], contractAddress, decimals);
      } else {
        return await tron.getTrxBalance(this.currentAccount['address'][TRON]);
      }
    },
    // 获取NULS上面的余额信息
    async getNulsAssetBalance(assetInfo) {
      const { chainId, assetId, contractAddress, decimals } = assetInfo;
      const tempParams = [{
        chainId,
        assetId,
        contractAddress
      }];
      const params = [NULS_INFO.chainId, this.currentAccount['address']['NULS'], tempParams];
      const url = NULS_INFO.batchRPC;
      const res = await this.$post(url, 'getBalanceList', params);
      if (res.result && res.result.length !== 0) {
        const tempAsset = res.result[0];
        return divisionDecimals(tempAsset.balance, decimals);
      } else {
        return 0;
      }
    },
    // 批量查询NULS上面的资产信息
    async getNulsNerveBatchData(assetList, network) {
      const tempParams = assetList.map(item => ({
        chainId: item.chainId,
        assetId: item.assetId,
        contractAddress: item.contractAddress
      }));
      const chainConfig = JSON.parse(sessionStorage.getItem('config'));
      const currentConfig = chainConfig[network];
      const params = [currentConfig.chainId, this.currentAccount['address'][network], tempParams];
      const url = currentConfig.apiUrl;
      const res = await this.$post(url, 'getBalanceList', params);
      if (res.result && res.result.length !== 0) {
        return res.result;
      } else {
        return [];
      }
    },
    // 批量查询nerve链上的资产
    async getNerveBatchData(assetList) {
      const tempParams = assetList.map(item => ({
        chainId: item.chainId,
        assetId: item.assetId,
        contractAddress: item.contractAddress
      }));
      const params = [MAIN_INFO.chainId, this.currentAccount['address']['NERVE'], tempParams];
      const url = MAIN_INFO.batchRPC;
      const res = await this.$post(url, 'getBalanceList', params);
      if (res.result && res.result.length !== 0) {
        return res.result;
      } else {
        return [];
      }
    },
    formatArrayLength(chain, data) {
      console.log('123131314343');
      const tradeHashList = JSON.parse(localStorage.getItem('tradeHashList')) || [];
      const l1HashList = localStorage.getItem('tradeHashMap') && JSON.parse(localStorage.getItem('tradeHashMap'))[chain] || [];
      const l2HashList = localStorage.getItem('l2HashList') && JSON.parse(localStorage.getItem('l2HashList')) || [];
      const tradeHashMap = localStorage.getItem('tradeHashMap') && JSON.parse(localStorage.getItem('tradeHashMap'));
      const l1Length = l1HashList.length;
      const l2Length = l2HashList.length;
      let tempArr = [...l1HashList];
      let tempL2Arr = [...l2HashList];
      console.log(data, 'datatata');
      if (data.type === 'L1') {
        if (l1Length < 100) {
          tempArr.unshift(data);
        } else {
          tempArr = tempArr.slice(0, 99);
          tempArr.unshift(data);
        }
      } else {
        if (l2Length < 100) {
          tempL2Arr.unshift(data);
        } else {
          tempL2Arr = tempL2Arr.slice(0, 99);
          tempL2Arr.unshift(data);
        }
      }
      // console.log(tempArr, 'tempArr');
      const tempTradeHashList = {
        ...tradeHashMap
      };
      console.log(tempTradeHashList[chain]);
      tempTradeHashList[chain] = [...tempArr];
      console.log(tempTradeHashList, 'tempTradeHashList');
      const tempL1HashList = localStorage.getItem('tradeHashMap') && JSON.parse(localStorage.getItem('tradeHashMap'))[chain] || [];
      const tempL2HashList = localStorage.getItem('l2HashList') && JSON.parse(localStorage.getItem('l2HashList')) || [];
      const tempL1Length = tempL1HashList.length;
      const tempL2Length = tempL2HashList.length;
      tempL2Length === l2Length && localStorage.setItem('l2HashList', JSON.stringify(tempL2Arr));
      tempL1Length === l1Length && localStorage.setItem('tradeHashMap', JSON.stringify(tempTradeHashList));
    }
  }
};
