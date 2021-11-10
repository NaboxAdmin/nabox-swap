import nerve from 'nerve-sdk-js'
import {BigNumber} from 'bignumber.js'
import copy from 'copy-to-clipboard'
import { MAIN_INFO, NULS_INFO, ETHNET} from '@/config.js'
import { post, request } from './https'

/**
 * 10的N 次方
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Power(arg) {
  let newPower = new BigNumber(10);
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
  let newPlus = new BigNumber(nu);
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
  let newMinus = new BigNumber(nu);
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
  let newTimes = new BigNumber(nu);
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
  let newDiv = new BigNumber(nu);
  return newDiv.div(arg);
}

/**
 * 数字乘以精度系数
 */
export function timesDecimals(nu, decimals) {
  if (!decimals) {
    return nu
  }
  return new BigNumber(Times(nu, Power(decimals)))
    .toFormat()
    .replace(/[,]/g, "");
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
    .replace(/[,]/g, "");
}

export function divisionAndFix(nu, decimals = 8, fix) {
  const newFix = fix ? fix : decimals
  const str = new BigNumber(Division(nu, Power(decimals))).toFixed(newFix)
  const pointIndex = str.indexOf(".");
  let lastStr = str.substr(str.length-1);
  let lastIndex = str.length;
  while(lastStr == 0 && lastIndex >= pointIndex) {
    lastStr = str.substr(lastIndex - 1, 1);
    if (lastStr == 0) {
      lastIndex = lastIndex -1
    }
  }
  lastIndex = str.substr(lastIndex - 1 , 1) === "." ? lastIndex -1 : lastIndex
  return str.substring(0,lastIndex)
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
    prefix = JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol
  }
  const newAddressInfo = nerve.importByKey(chainID(), pri, password, prefix);
  if (newAddressInfo.address === accountInfo.address) {
    return {success: true, pri: pri, pub: accountInfo.pub, aesPri: accountInfo.aesPri, address: newAddressInfo.address};
  } else {
    return {success: false};
  }
}

export function main_info() {
  let info = MAIN_INFO;
  if (sessionStorage.hasOwnProperty('info')) {
    let defaultAsset = JSON.parse(sessionStorage.getItem('info')).defaultAsset;
    info = defaultAsset;
    let prefixList = sessionStorage.hasOwnProperty('prefixData') ? JSON.parse(sessionStorage.getItem('prefixData')) : [];
    let prefixInfo = prefixList.filter(v => v.chainId === defaultAsset.chainId)[0];
    //console.log(prefixInfo);
    info.prefix = prefixInfo.addressPrefix ? prefixInfo.addressPrefix : MAIN_INFO.prefix;
  }
  return info
}

/**
 * 获取链ID
 * @returns {number}
 */
export function chainID() {
  const url = JSON.parse(localStorage.getItem('url'));
  if (url && url.urls) {
    return url.chainId
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
  let chainNumber = 'chainId' + chainID();
  let addressList = localStorage.hasOwnProperty(chainNumber) ? JSON.parse(localStorage.getItem(chainNumber)) : [];
  if (addressList) {
    if (type === 0) {
      return addressList
    } else {
      for (let item  of addressList) {
        if (item.selection) {
          return item
        }
      }
    }
  } else {
    return addressList
  }
}

/**
 * 超长数字显示
 * @param nu
 * @param powerNu
 * @returns {string}
 */
export function langNumber(nu, powerNu) {
  let newNu = new BigNumber(Division(nu, powerNu).toString());
  return newNu.toFormat().replace(/[,]/g, '');
}

/**
 * 字符串中间显示....
 * @param string
 * @param leng
 * @returns {*}
 */
export function superLong(string, leng) {
  if (string && string.length > 10) {
    return string.substr(0, leng) + "...." + string.substr(string.length - leng, string.length);
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
  let dateEnd = new Date();    //结束时间
  let newDate = dateEnd.getTime() - dateBegin;   //时间差的毫秒数
  let days = Math.floor(newDate / (24 * 3600 * 1000));//计算出相差天数
  let leave1 = newDate % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000));
  let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000));
  let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000);
  return {days: days, hours: hours, minutes: minutes, seconds: seconds};
}

/**
 * 根据不同时区显示时间
 * @param time
 * @returns {*}
 */
export function getLocalTime(time) {
  if (typeof time !== 'number') return;
  let d = new Date();
  let offset = d.getTimezoneOffset() * 60000;
  let localUtc = new Date().getTimezoneOffset() / 60;
  let utcTime;
  if (localUtc > 0) {
    utcTime = time - offset;
  } else {
    utcTime = time + offset;
  }
  let localTime = utcTime + 3600000 * Math.abs(localUtc);
  return new Date(localTime);
}

/**
 * 获取参数的必填值
 * @param parameterList
 * @returns {{allParameter: boolean, args: Array}}
 */
export function getArgs(parameterList) {
  //console.log(parameterList);
  let newArgs = [];
  let allParameter = false;
  if (parameterList.length !== 0) {
    //循环获取必填参数
    for (let itme of parameterList) {
      if (itme.required) {
        if (itme.value) {
          allParameter = true;
          newArgs.push(itme.value)
        } else {
          return {allParameter: false, args: newArgs};
        }
      } else {
        allParameter = true;
        if (!itme.value) {
          newArgs.push('')
        } else {
          newArgs.push(itme.value)
        }
      }
    }
    return {allParameter: allParameter, args: newArgs};
  } else {
    return {allParameter: true, args: newArgs};
  }
}


//地址必须参数列表
export const defaultAddressInfo = {
  address: '', //地址
  aesPri: '',//加密私钥
  pub: '',//公钥
  selection: false,//是否选中
  alias: "",//别名
  remark: "",//标签（备注）
  balance: 0,//余额
  consensusLock: 0,//锁定金额
  totalReward: 0,//总奖励
  tokens: [],//代币列表
  contactList: [],//合约列表（收藏的合约）
};

//地址信息写入localStorage
export function localStorageByAddressInfo(newAddressInfo) {
  let addressList = [];
  let newAddressList = [];
  newAddressList.push(newAddressInfo);
  const chainNumber = 'chainId' + chainID();
  //console.log(chainNumber);
  let newArr = localStorage.hasOwnProperty(chainNumber) ? JSON.parse(localStorage.getItem(chainNumber)) : [];
  //console.log(newArr);
  if (newArr.length !== 0) {
    let ifAddress = false;
    for (let item of newArr) {
      if (item.address === newAddressInfo.address) {
        item.aesPri = newAddressInfo.aesPri;
        item.pub = newAddressInfo.pub;
        ifAddress = true
      }
      if (item.selection) {
        newAddressList[0].selection = false;
      }
    }
    if (ifAddress) {
      addressList = [...newArr]
    } else {
      addressList = [...newArr, ...newAddressList]
    }
  } else {
    newAddressInfo.selection = true;
    addressList.push(newAddressInfo);
  }
  //console.log(addressList);
  return addressList
}

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export function equalsObj(oldData, newData) {
  //类型为基本类型时,如果相同,则返回true
  if (oldData === newData) return true;
  if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
    //类型为对象并且元素个数相同
    //遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key]))
        //对象中具有不相同属性 返回false
          return false;
      }
    }
  } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
    //类型为数组并且数组长度相同
    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i]))
      //如果数组元素中具有不相同元素,返回false
        return false;
    }
  } else {
    //其它类型,均返回false
    return false;
  }
  //走到这里,说明数组或者对象中所有元素都相同,返回true
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
  let chars = 'ABCDEFGHJKLMNOPQRSVTWXYIUZabcdefhijkmnprstwxyzovu0123456789';
  let maxPos = chars.length;
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
  let s = "";
  if (str.length === 0) {
    return "";
  }
  s = str.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\\'/g, "&#39;"); //IE下不支持实体名称
  s = s.replace(/\\"/g, "&quot;");
  return s;
}

/**
 *  转义字符还原成html字符
 * @param str
 * @returns {string}
 * @constructor
 */
export function htmlRestore(str) {
  let s = "";
  if (str.length === 0) {
    return "";
  }
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "/\\'");
  s = s.replace(/&quot;/g, "/\"");
  return s;
}

//转千分位
export function toThousands(num = 0) {
  const N = num.toString().split('.');
  const int = N[0];
  const float = N[1] ? '.' + N[1] : '';
  return int.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + float;
}

//获取币种配置
export async function getSymbolInfo(chainId, assetId, refresh = false) {
  if (!assetId || !chainId) return;
  const symbol = chainId + '-' + assetId;
  let coinInfo = JSON.parse(sessionStorage.getItem("coinInfo")) || {};
  if (coinInfo[symbol]&&!refresh) {
    return coinInfo[symbol]
  }
  try {
    //console.log(assetId, chainId);
    const res = await post('/', 'getSymbolInfo', [chainId, assetId]);
    //console.info(res);
    if (res.result.symbol) {
      const symbol = chainId + '-' + assetId;
      const coinInfo = JSON.parse(sessionStorage.getItem("coinInfo")) || {};
      coinInfo[symbol] = res.result;
      sessionStorage.setItem('coinInfo', JSON.stringify(coinInfo))
    }
    return res.result || {}
  } catch (e) {
    console.error('获取币种信息失败' + chainId + '-' + assetId)
  }
}

/**
 * 保留指定小数位数
 * @param val 要处理的数据，Number | String
 * @param len 保留小数位数，位数不足时，以0填充
 * @param side 1|-1 对应 入|舍
 * @returns {string|number}
 */
export function tofix(val, len, side) {
  const numval = Number(val);
  if (isNaN(numval)) return 0;
  const str = val.toString();
  if (str.indexOf('.') > -1) {
    let numArr = str.split('.');
    if (numArr[1].length > len) {
      let tempnum = numval * Math.pow(10, len);
      if (!side) {
        return Number(val).toFixed(len)
      } else if (side === 1) {
        if (tempnum < 1) return (1 / Math.pow(10, len));
        return (Math.ceil(tempnum) / Math.pow(10, len)).toFixed(len)
      } else if (side === -1) {
        return (Math.floor(tempnum) / Math.pow(10, len)).toFixed(len)
      } else {
        return Number(val.toFixed(len))
      }
    } else {
      return Number(str).toFixed(len)
    }
  } else {
    return Number(val).toFixed(len)
  }
}

/**
 * @disc: 判断pc和手机端
 * @date: 2020-05-29 16:51
 * @author: Wave
 */
export function IsPC() {
  let userAgentInfo = navigator.userAgent;
  let Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}


//资产排序
export function assetSort(assets) {
  const sortOrder = ['NVT', 'NULS', 'ETH']
  function indexOf(item) {
    return sortOrder.indexOf(item.symbol)
  }
  return assets.filter(v=>v.symbol!=='CNVT').sort(function(a,b) {
    if (indexOf(a) > -1 && indexOf(b) > -1) {
      return indexOf(a) - indexOf(b);
    } else if (indexOf(a) > -1 || indexOf(b) > -1) {
      return indexOf(b) - indexOf(a);
    } else {
      return a.symbol > b.symbol ? 1 : -1
    }
  })
}

export const isBeta = ETHNET === 'ropsten'

export const networkOrigin = {
  NERVE: isBeta ? 'http://beta.scan.nerve.network' : 'https://scan.nerve.network',
  NULS: isBeta ? 'http://beta.nulscan.io' : 'https://nulscan.io',
  Ethereum: isBeta ? 'https://ropsten.etherscan.io' : 'https://etherscan.io',
  BSC: isBeta ? 'https://testnet.bscscan.com' : 'https://bscscan.com',
  Heco: isBeta ? 'https://testnet.hecoinfo.com' : 'https://hecoinfo.com',
  OKExChain: isBeta ? "https://www.oklink.com/okexchain-test" : "https://www.oklink.com/okexchain",
  Harmony: isBeta ?  "https://explorer.harmony.one/" : "https://explorer.pops.one/",
  Polygon: isBeta ?  "https://mumbai.polygonscan.com/" : "https://explorer.matic.network/",
  KCC:  isBeta ?  "https://scan-testnet.kcc.network" : "https://explorer.kcc.io/",
}

export const hashLinkList = {
  Ethereum: isBeta ? 'https://ropsten.etherscan.io/tx/' : 'https://etherscan.io/tx/',
  BSC: isBeta ? 'https://testnet.bscscan.com/tx/' : 'https://bscscan.com/tx/',
  Heco: isBeta ? 'https://testnet.hecoinfo.com/tx/' : 'https://hecoinfo.com/tx/',
  OKExChain: isBeta ? "https://www.oklink.com/okexchain-test/tx/" : 'https://www.oklink.com/okexchain/tx/',
  NULS: isBeta ? 'http://beta.nulscan.io/transaction/info?hash=' : 'https://nulscan.io/transaction/info?hash=',
  NERVE: isBeta ? 'http://beta.scan.nerve.network/transaction/info?hash=' : 'https://scan.nerve.network/transaction/info?hash='
}

export const addressNetworkOrigin = {
  NERVE: isBeta ? 'http://beta.scan.nerve.network/address/info?address=' : 'https://scan.nerve.network/address/info?address=',
  NULS: isBeta ? 'http://beta.nulscan.io/address/info?address=' : 'https://nulscan.io/address/info?address=',
  Ethereum: isBeta ? 'https://ropsten.etherscan.io/address/' : 'https://etherscan.io/address/',
  BSC: isBeta ? 'https://testnet.bscscan.com/address/' : 'https://bscscan.com/address/',
  Heco: isBeta ? 'https://testnet.hecoinfo.com/address/' : 'https://hecoinfo.com/address/',
  OKExChain: isBeta ? "https://www.oklink.com/okexchain-test/address/" : "https://www.oklink.com/okexchaint/address/",
  Harmony: isBeta ?  "https://explorer.harmony.one/address/" : "https://explorer.pops.one/address/",
  Polygon: isBeta ?  "https://mumbai.polygonscan.com/address/" : "https://explorer.matic.network/address/",
  KCC:  isBeta ?  "https://scan-testnet.kcc.network/address/" : "https://explorer.kcc.io/address/"
}

export const networkRpc = {
  // Ethereum: isBeta ? 'https://ropsten.etherscan.io' : 'https://etherscan.io',
  BSC: isBeta ? 'https://data-seed-prebsc-1-s1.binance.org:8545/' : 'https://bsc-dataseed.binance.org/',
  Heco: isBeta ? 'https://http-testnet.hecochain.com' : 'https://http-mainnet.hecochain.com',
  OKExChain: isBeta ? "https://exchaintestrpc.okex.org" : "https://exchainrpc.okex.org",
  Harmony: isBeta ? "https://api.s0.b.hmny.io" : "https://api.harmony.one",
  Polygon: isBeta ? "https://rpc-mumbai.maticvigil.com/" : "https://rpc-mainnet.maticvigil.com/",
  KCC: isBeta ? "https://rpc-testnet.kcc.network" : "https://rpc-mainnet.kcc.network",
}

export function getLogoSrc(symbol) {
  return "https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/" + symbol + ".png"
}


// export const supportChainList = [
//   { label: "NERVE", value: "NERVE", symbol: "NVT", SwftChain: "NERVE", chainId: MAIN_INFO.chainId, assetId: MAIN_INFO.assetId },
//   { label: "NULS", value: "NULS", symbol:"NULS", SwftChain: "NULS", chainId: NULS_INFO.chainId, assetId: NULS_INFO.assetId },
//   { label: "Ethereum", value: "Ethereum", symbol:"ETH", ropsten: "0x3", SwftChain: "Ethereum", homestead: "0x1", chainId: 101, assetId: 1 },
//   { label: "BSC", value: "BSC", symbol:"BNB", ropsten: "0x61", homestead: "0x38", SwftChain: "BSC", chainId: 102, assetId: 1, origin: networkOrigin.BSC, rpcUrl: {ropsten: "https://data-seed-prebsc-1-s1.binance.org:8545/", homestead: "https://bsc-dataseed.binance.org/"}},
//   { label: "Heco", value: "Heco", symbol:"HT", ropsten: "0x100", homestead: "0x80", SwftChain: "Heco", chainId: 103, assetId: 1, origin: networkOrigin.Heco, rpcUrl: {ropsten: "https://http-testnet.hecochain.com",homestead: "https://http-mainnet.hecochain.com"}},
//   { label: "OKExChain", value: "OKExChain", symbol:"OKT", ropsten: "0x41", homestead: "0x42", SwftChain: "OKExChain", chainId: 104, origin: networkOrigin.OKExChain, assetId: 1, rpcUrl: {ropsten: "https://exchaintestrpc.okex.org",homestead: "https://exchainrpc.okex.org"}}
// ];

// TODO:多链
export const supportChainList = sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || [];
// console.log(supportChainList, '==supportChainListTest==')

// export const supportChainList = [
//   {
//     label: "Ethereum",
//     value: "Ethereum",
//     symbol: "ETH",
//     ropsten: "0x3",
//     SwftChain: "Ethereum",
//     homestead: "0x1",
//     chainId: 101,
//     assetId: 1,
//     origin: networkOrigin.Ethereum
//   },
//   {
//     label: "BSC",
//     value: "BSC",
//     symbol: "BNB",
//     ropsten: "0x61",
//     homestead: "0x38",
//     SwftChain: "BSC",
//     chainId: 102,
//     assetId: 1,
//     origin: networkOrigin.BSC,
//     decimals: 18,
//     rpcUrl: {
//       ropsten: "https://data-seed-prebsc-1-s1.binance.org:8545/",
//       homestead: "https://bsc-dataseed.binance.org/"
//     }
//   },
//   {
//     label: "Heco",
//     value: "Heco",
//     symbol: "HT",
//     ropsten: "0x100",
//     homestead: "0x80",
//     SwftChain: "Heco",
//     chainId: 103,
//     assetId: 1,
//     origin: networkOrigin.Heco,
//     decimals: 18,
//     rpcUrl: {
//       ropsten: "https://http-testnet.hecochain.com",
//       homestead: "https://http-mainnet.hecochain.com"
//     }
//   },
//   {
//     label: "OKExChain",
//     value: "OKExChain",
//     symbol: "OKT",
//     ropsten: "0x41",
//     homestead: "0x42",
//     SwftChain: "OKExChain",
//     chainId: 104,
//     assetId: 1,
//     origin: networkOrigin.OKExChain,
//     decimals: 18,
//     rpcUrl: {
//       ropsten: "https://exchaintestrpc.okex.org",
//       homestead: "https://exchainrpc.okex.org"
//     }
//   },
//   {
//     label: "NULS",
//     value: "NULS",
//     symbol: "NULS",
//     SwftChain: "NULS",
//     chainId: NULS_INFO.chainId,
//     assetId: NULS_INFO.assetId,
//     origin: networkOrigin.NULS
//   },
//   {
//     label: "NERVE",
//     value: "NERVE",
//     symbol: "NVT",
//     SwftChain: "NERVE",
//     chainId: MAIN_INFO.chainId,
//     assetId: MAIN_INFO.assetId,
//     origin: networkOrigin.NERVE
//   }
// ];

export function debounce(fn, delay) {
  let timer
  return function() {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null
    }, delay)
  }
}

export function genID() {
  return (
    Date.now() +
    Number(
      Math.random()
        .toString()
        .split(".")[1]
    )
  ).toString(36);
}

export function getCurrentAccount(address) {
  const accountList = JSON.parse(localStorage.getItem('accountList')) || [];
  return accountList.find(account => {
    return Object.keys(account.address).find(item => account.address[item] === address)
  })
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
    const config = JSON.parse(sessionStorage.getItem("config"));
    const mainAsset = config[data.network]; //来源链(eth,bnb,heco)主资产信息
    params = {chainId: mainAsset.chainId, contractAddress: data.contractAddress};
  } else {
    params = {chainId: data.assetsChainId, assetId: data.assetsId};
  }
  try {
    const res = await request({url: "/asset/nerve/chain/info", data: params});
    if (res.code === 1000) {
      result = res.data;
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}