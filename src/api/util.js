import nerve from 'nerve-sdk-js';
import { BigNumber } from 'bignumber.js';
import copy from 'copy-to-clipboard';
import {MAIN_INFO, ETHNET, TRON_MULTI_CALL_ADDRESS} from '@/config.js';
import { post, request } from '../network/http';

/**
 * 10的N 次方
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Power(arg) {
  const newPower = new BigNumber(10);
  return newPower.pow(arg);
}

/**
 * 加法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Plus(nu, arg) {
  const newPlus = new BigNumber(nu);
  return newPlus.plus(arg);
}

/**
 * 减法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Minus(nu, arg) {
  const newMinus = new BigNumber(nu);
  return newMinus.minus(arg);
}

/**
 * 乘法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Times(nu, arg) {
  const newTimes = new BigNumber(nu);
  return newTimes.times(arg);
}

/**
 * 除法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Division(nu, arg) {
  const newDiv = new BigNumber(nu);
  return newDiv.div(arg);
}

/**
 * 数字乘以精度系数
 */
export function timesDecimals(nu, decimals) {
  if (!decimals) {
    return nu;
  }
  return new BigNumber(Times(nu, Power(decimals)))
    .toFormat()
    .replace(/[,]/g, '');
}

/**
 * 数字除以精度系数
 */
export function divisionDecimals(nu, decimals = '') {
  if (!decimals) {
    return nu;
  }
  return new BigNumber(Division(nu, Power(decimals)))
    .toFormat()
    .replace(/[,]/g, '');
}

export function divisionAndFix(nu, decimals = 8, fix) {
  const newFix = fix || decimals;
  const str = new BigNumber(Division(nu, Power(decimals))).toFixed(newFix);
  const pointIndex = str.indexOf('.');
  let lastStr = str.substr(str.length - 1);
  let lastIndex = str.length;
  while (lastStr == 0 && lastIndex >= pointIndex) {
    lastStr = str.substr(lastIndex - 1, 1);
    if (lastStr == 0) {
      lastIndex = lastIndex - 1;
    }
  }
  lastIndex = str.substr(lastIndex - 1, 1) === '.' ? lastIndex - 1 : lastIndex;
  return str.substring(0, lastIndex);
}

/**
 * @disc: 验证密码
 * @params:  accountInfo
 * @params:  password
 * @params:  prefix
 * @date: 2019-08-22 12:05
 * @author: Wave
 */
export function passwordVerification(accountInfo, password, prefix) {
  const pri = nerve.decrypteOfAES(accountInfo.aesPri, password);
  if (!prefix && sessionStorage.hasOwnProperty('info')) {
    prefix = JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol;
  }
  const newAddressInfo = nerve.importByKey(chainID(), pri, password, prefix);
  if (newAddressInfo.address === accountInfo.address) {
    return {
      success: true,
      pri: pri,
      pub: accountInfo.pub,
      aesPri: accountInfo.aesPri,
      address: newAddressInfo.address
    };
  } else {
    return { success: false };
  }
}

export function main_info() {
  let info = MAIN_INFO;
  if (sessionStorage.hasOwnProperty('info')) {
    const defaultAsset = JSON.parse(sessionStorage.getItem('info')).defaultAsset;
    info = defaultAsset;
    const prefixList = sessionStorage.hasOwnProperty('prefixData') ? JSON.parse(sessionStorage.getItem('prefixData')) : [];
    const prefixInfo = prefixList.filter(v => v.chainId === defaultAsset.chainId)[0];
    // console.log(prefixInfo);
    info.prefix = prefixInfo.addressPrefix ? prefixInfo.addressPrefix : MAIN_INFO.prefix;
  }
  return info;
}

/**
 * 获取链ID
 * @returns {number}
 */
export function chainID() {
  const url = JSON.parse(localStorage.getItem('url'));
  if (url && url.urls) {
    return url.chainId;
  } else {
    return main_info().chainId;
  }
}

/**
 * 获取chainId+number
 * @returns {string}
 */
export function chainIdNumber() {
  return 'chainId' + chainID();
}

/**
 * 获取地址列表或选择地址
 * @param type 0:地址列表，1:选中地址
 * @returns {*}
 */
export function addressInfo(type) {
  const chainNumber = 'chainId' + chainID();
  const addressList = localStorage.hasOwnProperty(chainNumber) ? JSON.parse(localStorage.getItem(chainNumber)) : [];
  if (addressList) {
    if (type === 0) {
      return addressList;
    } else {
      for (const item of addressList) {
        if (item.selection) {
          return item;
        }
      }
    }
  } else {
    return addressList;
  }
}

/**
 * 超长数字显示
 * @param nu
 * @param powerNu
 * @returns {string}
 */
export function langNumber(nu, powerNu) {
  const newNu = new BigNumber(Division(nu, powerNu).toString());
  return newNu.toFormat().replace(/[,]/g, '');
}

/**
 * 字符串中间显示....
 * @param string
 * @param leng
 * @returns {*}
 */
export function superLong(string, leng) {
  if (string && string.length > 18) {
    return string.substr(0, leng) + '....' + string.substr(string.length - leng, string.length);
  } else {
    return string;
  }
}

/**
 * 复制 copy
 * @param value
 */
export const copys = (value) => copy(value);

/**
 * 计数时间差
 * @param dateBegin
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
export function timeDifference(dateBegin) {
  const dateEnd = new Date(); // 结束时间
  const newDate = dateEnd.getTime() - dateBegin; // 时间差的毫秒数
  const days = Math.floor(newDate / (24 * 3600 * 1000));// 计算出相差天数
  const leave1 = newDate % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000));
  const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000));
  const leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000);
  return { days: days, hours: hours, minutes: minutes, seconds: seconds };
}

/**
 * 根据不同时区显示时间
 * @param time
 * @returns {*}
 */
export function getLocalTime(time) {
  if (typeof time !== 'number') return;
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  const localUtc = new Date().getTimezoneOffset() / 60;
  let utcTime;
  if (localUtc > 0) {
    utcTime = time - offset;
  } else {
    utcTime = time + offset;
  }
  const localTime = utcTime + 3600000 * Math.abs(localUtc);
  return new Date(localTime);
}

/**
 * 获取参数的必填值
 * @param parameterList
 * @returns {{allParameter: boolean, args: Array}}
 */
export function getArgs(parameterList) {
  // console.log(parameterList);
  const newArgs = [];
  let allParameter = false;
  if (parameterList.length !== 0) {
    // 循环获取必填参数
    for (const itme of parameterList) {
      if (itme.required) {
        if (itme.value) {
          allParameter = true;
          newArgs.push(itme.value);
        } else {
          return { allParameter: false, args: newArgs };
        }
      } else {
        allParameter = true;
        if (!itme.value) {
          newArgs.push('');
        } else {
          newArgs.push(itme.value);
        }
      }
    }
    return { allParameter: allParameter, args: newArgs };
  } else {
    return { allParameter: true, args: newArgs };
  }
}

// 地址必须参数列表
export const defaultAddressInfo = {
  address: '', // 地址
  aesPri: '', // 加密私钥
  pub: '', // 公钥
  selection: false, // 是否选中
  alias: '', // 别名
  remark: '', // 标签（备注）
  balance: 0, // 余额
  consensusLock: 0, // 锁定金额
  totalReward: 0, // 总奖励
  tokens: [], // 代币列表
  contactList: []// 合约列表（收藏的合约）
};

// 地址信息写入localStorage
export function localStorageByAddressInfo(newAddressInfo) {
  let addressList = [];
  const newAddressList = [];
  newAddressList.push(newAddressInfo);
  const chainNumber = 'chainId' + chainID();
  // console.log(chainNumber);
  const newArr = localStorage.hasOwnProperty(chainNumber) ? JSON.parse(localStorage.getItem(chainNumber)) : [];
  // console.log(newArr);
  if (newArr.length !== 0) {
    let ifAddress = false;
    for (const item of newArr) {
      if (item.address === newAddressInfo.address) {
        item.aesPri = newAddressInfo.aesPri;
        item.pub = newAddressInfo.pub;
        ifAddress = true;
      }
      if (item.selection) {
        newAddressList[0].selection = false;
      }
    }
    if (ifAddress) {
      addressList = [...newArr];
    } else {
      addressList = [...newArr, ...newAddressList];
    }
  } else {
    newAddressInfo.selection = true;
    addressList.push(newAddressInfo);
  }
  // console.log(addressList);
  return addressList;
}

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export function equalsObj(oldData, newData) {
  // 类型为基本类型时,如果相同,则返回true
  if (oldData === newData) return true;
  if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
    // 类型为对象并且元素个数相同
    // 遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key]))
        // 对象中具有不相同属性 返回false
        { return false; }
      }
    }
  } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
    // 类型为数组并且数组长度相同
    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i]))
      // 如果数组元素中具有不相同元素,返回false
      { return false; }
    }
  } else {
    // 其它类型,均返回false
    return false;
  }
  // 走到这里,说明数组或者对象中所有元素都相同,返回true
  return true;
}

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 * @disc: 随机数
 * @params: len
 * @date: 2019-12-02 14:43
 * @author: Wave
 */
export function getRamNumber(len) {
  const chars = 'ABCDEFGHJKLMNOPQRSVTWXYIUZabcdefhijkmnprstwxyzovu0123456789';
  const maxPos = chars.length;
  let ramNumber = '';
  for (let i = 0; i < len; i++) {
    ramNumber += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return ramNumber;
}

/**
 *  把html转义成HTML实体字符
 * @param str
 * @returns {string}
 * @constructor
 */
export function htmlEncode(str) {
  let s = '';
  if (str.length === 0) {
    return '';
  }
  s = str.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
  s = s.replace(/ /g, '&nbsp;');
  s = s.replace(/\\'/g, '&#39;'); // IE下不支持实体名称
  s = s.replace(/\\"/g, '&quot;');
  return s;
}

/**
 *  转义字符还原成html字符
 * @param str
 * @returns {string}
 * @constructor
 */
export function htmlRestore(str) {
  let s = '';
  if (str.length === 0) {
    return '';
  }
  s = str.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#39;/g, "/\\'");
  s = s.replace(/&quot;/g, '/"');
  return s;
}

// 转千分位
export function toThousands(num = 0) {
  const N = num.toString().split('.');
  const int = N[0];
  const float = N[1] ? '.' + N[1] : '';
  return int.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + float;
}

// 获取币种配置
export async function getSymbolInfo(chainId, assetId, refresh = false) {
  if (!assetId || !chainId) return;
  const symbol = chainId + '-' + assetId;
  const coinInfo = JSON.parse(sessionStorage.getItem('coinInfo')) || {};
  if (coinInfo[symbol] && !refresh) {
    return coinInfo[symbol];
  }
  try {
    // console.log(assetId, chainId);
    const res = await post('/', 'getSymbolInfo', [chainId, assetId]);
    // console.info(res);
    if (res.result.symbol) {
      const symbol = chainId + '-' + assetId;
      const coinInfo = JSON.parse(sessionStorage.getItem('coinInfo')) || {};
      coinInfo[symbol] = res.result;
      sessionStorage.setItem('coinInfo', JSON.stringify(coinInfo));
    }
    return res.result || {};
  } catch (e) {
    console.error('获取币种信息失败' + chainId + '-' + assetId);
  }
}

/**
 * 保留指定小数位数
 * @param val 要处理的数据，Number | String
 * @param len 保留小数位数，位数不足时，以0填充
 * @param side 1|-1 对应 入|舍
 * @returns {string|number}
 */
export function tofix(val, len, side = -1) {
  const numval = Minus(val, 0); // Number(val);
  if (isNaN(numval)) return 0;
  const str = val.toString();
  if (str.indexOf('.') > -1) {
    const numArr = str.split('.');
    if (numArr[1].length > len) {
      const tempnum = numval * Math.pow(10, len);
      if (!side) {
        return Number(val).toFixed(len);
      } else if (side === 1) {
        if (tempnum < 1) return (1 / Math.pow(10, len));
        return (Math.ceil(tempnum) / Math.pow(10, len)).toFixed(len);
      } else if (side === -1) {
        // return (Math.floor(tempnum) / Math.pow(10, len)).toFixed(len);
        return str.substring(0, str.indexOf('.') + 1 + len);
      } else {
        return Number(val.toFixed(len));
      }
    } else {
      // return Number(str).toFixed(len);
      return str;
    }
  } else {
    return str;
  }
}

/**
 * @disc: 判断pc和手机端
 * @date: 2020-05-29 16:51
 * @author: Wave
 */
export function IsPC() {
  const userAgentInfo = navigator.userAgent;
  const Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod'];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

// 资产排序
export function assetSort(assets) {
  const sortOrder = ['NVT', 'NULS', 'ETH'];

  function indexOf(item) {
    return sortOrder.indexOf(item.symbol);
  }

  return assets.filter(v => v.symbol !== 'CNVT').sort(function(a, b) {
    if (indexOf(a) > -1 && indexOf(b) > -1) {
      return indexOf(a) - indexOf(b);
    } else if (indexOf(a) > -1 || indexOf(b) > -1) {
      return indexOf(b) - indexOf(a);
    } else {
      return a.symbol > b.symbol ? 1 : -1;
    }
  });
}

export const isBeta = ETHNET === 'ropsten';

export const TRON = 'TRON';

// TODO:多链
export const supportChainList = sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || [];

export function debounce(fn, delay) {
  let timer;
  return function() {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

export function genID() {
  return (
    Date.now() +
        Number(
          Math.random()
            .toString()
            .split('.')[1]
        )
  ).toString(36);
}

export function getCurrentAccount(address) {
  const accountList = JSON.parse(localStorage.getItem('accountList')) || [];
  return accountList.find(account => {
    return Object.keys(account.address).find(item => account.address[item].toLocaleLowerCase() === address.toLocaleLowerCase());
  });
}

export function getCurrentAccountIndex(address) {
  const accountList = JSON.parse(localStorage.getItem('accountList')) || [];
  return accountList.findIndex(account => {
    return Object.keys(account.address).find(item => account.address[item] === address);
  });
}

/**
 * data.network 当前网络 beta/main
 * data.fromChain 来源链
 * data.contractAddress  eth、bnb上token资产合约地址
 * data.assetsChainId
 * data.assetsId
 */
export async function getAssetNerveInfo(data) {
  let result = null;
  let params = {};
  if (data.contractAddress) {
    const config = JSON.parse(sessionStorage.getItem('config'));
    const mainAsset = config[data.network]; // 来源链(eth,bnb,heco)主资产信息
    params = { chainId: mainAsset.chainId, contractAddress: data.contractAddress };
  } else {
    params = { chainId: data.assetsChainId, assetId: data.assetsId };
  }
  try {
    const res = await request({ url: '/asset/nerve/chain/info', data: params });
    if (res.code === 1000) {
      result = res.data;
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

export function formatFloatNumber(precision = 6, number) {
  if (typeof number === 'undefined' || number === null) return '';
  if (number === 0) return '0';
  const roundedValue = round(precision, number);
  const floorValue = Math.floor(roundedValue);
  const isInteger = Math.abs(floorValue - roundedValue) < Number.EPSILON;
  const numberOfFloorDigits = String(floorValue).length;
  const numberOfDigits = String(roundedValue).length;
  if (numberOfFloorDigits > precision) {
    return String(floorValue);
  } else {
    const padding = isInteger ? precision - numberOfFloorDigits : precision - numberOfDigits + 1;
    if (padding > 0) {
      if (isInteger) {
        return `${String(floorValue)}.${'0'.repeat(padding)}`;
      } else {
        return `${String(roundedValue)}${'0'.repeat(padding)}`;
      }
    } else {
      return String(roundedValue);
    }
  }
}

function round(precision, number) {
  return parseFloat(parseFloat(number).toPrecision(precision));
}

export function numberFormat(val, float, returnBoo = false) {
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
}

export function setChainConfig(chainConfig) {
  const config = {};
  if (chainConfig && chainConfig.length) {
    chainConfig.map(v => {
      const mainInfo = v.mainAsset;
      let configs;
      if (v.chainType === 3) {
        configs = {
          multiCallAddress: TRON_MULTI_CALL_ADDRESS,
          crossAddress: v.configs.crossAddress
        };
      } else {
        configs = v.configs;
      }
      config[v.chain] = {
        chain: v.chain,
        chainId: mainInfo ? mainInfo.chainId : '',
        assetId: mainInfo ? mainInfo.assetId : '',
        prefix: v.prefix,
        symbol: mainInfo ? mainInfo.symbol : '',
        decimals: mainInfo ? mainInfo.decimals : '',
        assets: v.assets,
        config: configs,
        apiUrl: v.chainType === 3 ? v.psUrl : v.apiUrl,
        chainType: v.chainType,
        nativeId: v.nativeId
      };
    });
    // chainType: 2 以太系
    const supportChainList = chainConfig.map(item => {
      if (item.chainType === 1) {
        return {
          ...item,
          label: item.chain,
          value: item.chain,
          SwftChain: item.chain,
          chainId: item.mainAsset && item.mainAsset.chainId || '',
          assetId: item.mainAsset && item.mainAsset.assetId || '',
          decimals: item.mainAsset && item.mainAsset.decimals || '',
          hashLink: `${item.scanUrl}transaction/info?hash=`,
          addressLink: `${item.scanUrl}address/info?address=`,
          symbol: item.mainAsset.symbol || '',
          sort: item.sort,
          ropsten: `0x${Number(item.nativeId).toString(16)}`,
          homestead: `0x${Number(item.nativeId).toString(16)}`,
          nativeId: item.nativeId
        };
      } else if (item.chainType === 2) {
        return {
          label: item.chain,
          value: item.chain,
          chain: item.chain,
          chainName: item.chain,
          chainType: item.chainType,
          icon: item.icon,
          symbol: item.mainAsset && item.mainAsset.symbol || '',
          ropsten: `0x${Number(item.nativeId).toString(16)}`,
          homestead: `0x${Number(item.nativeId).toString(16)}`,
          chainId: item.mainAsset && item.mainAsset && item.mainAsset.chainId || '',
          assetId: item.mainAsset && item.mainAsset.assetId || '',
          decimals: item.mainAsset && item.mainAsset.decimals || '',
          rpcUrl: item.apiUrl,
          nativeId: item.nativeId || '',
          // rpcUrl: networkRpc[item.chain],
          origin: item.scanUrl,
          hashLink: `${item.scanUrl}tx/`,
          addressLink: `${item.scanUrl}address/`,
          sort: item.sort
        };
      } else if (item.chainType === 3) {
        return {
          label: item.chain,
          value: item.chain,
          chain: item.chain,
          chainName: item.chain,
          chainType: item.chainType,
          icon: item.icon,
          symbol: item.mainAsset && item.mainAsset.symbol || '',
          ropsten: `0x${Number(item.nativeId).toString(16)}`,
          homestead: `0x${Number(item.nativeId).toString(16)}`,
          chainId: item.mainAsset && item.mainAsset && item.mainAsset.chainId || '',
          assetId: item.mainAsset && item.mainAsset.assetId || '',
          decimals: item.mainAsset && item.mainAsset.decimals || '',
          rpcUrl: item.apiUrl,
          nativeId: item.nativeId || '',
          // rpcUrl: networkRpc[item.chain],
          origin: item.scanUrl,
          hashLink: `${item.scanUrl}/transaction/`,
          addressLink: `${item.scanUrl}/address/`,
          sort: item.sort
        };
      }
    });
    const sortSupportChainList = supportChainList.sort((a, b) => a.sort - b.sort);
    sessionStorage.setItem('supportChainList', JSON.stringify(sortSupportChainList));
  }
  const chains = Object.keys(config);
  const tradeHashMap = {};
  chains.forEach(chain => {
    tradeHashMap[chain] = [];
  });
  if (!localStorage.getItem('tradeHashMap')) { // 兼容处理防止改名
    localStorage.setItem('tradeHashMap', JSON.stringify(tradeHashMap));
  } else {
    const tradeHashMap = JSON.parse(localStorage.getItem('tradeHashMap'));
    const hashKeys = Object.keys(tradeHashMap);
    const diffKeys = hashKeys.filter(key => {
      return chains.indexOf(key) === -1;
    });
    if (diffKeys.length !== 0) {
      for (const item of diffKeys) {
        delete tradeHashMap[item];
      }
      localStorage.setItem('tradeHashMap', JSON.stringify(tradeHashMap));
    }
  }
  if (!localStorage.getItem('localSwapAssetMap')) {
    localStorage.setItem('localSwapAssetMap', JSON.stringify(tradeHashMap));
  } else {
    const localSwapAssetMap = JSON.parse(localStorage.getItem('localSwapAssetMap'));
    const hashKeys = Object.keys(localSwapAssetMap);
    const diffKeys = hashKeys.filter(key => {
      return chains.indexOf(key) === -1;
    });
    if (diffKeys.length !== 0) {
      for (const item of diffKeys) {
        delete localSwapAssetMap[item];
      }
      localStorage.setItem('localSwapAssetMap', JSON.stringify(localSwapAssetMap));
    }
  }
  !localStorage.getItem('l2HashList') && localStorage.setItem('l2HashList', JSON.stringify([]));
  sessionStorage.setItem('config', JSON.stringify(config));
}
