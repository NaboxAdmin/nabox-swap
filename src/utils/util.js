// 节流
const throttle = (fn, gapTime) => {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;// 间隔时间
  }
  let _lastTime = 0;

  // 返回新的函数
  return function() {
    const _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); // 将this和参数传给原函数
      _lastTime = _nowTime; // 将最后操作时间置为当前时间
    }
  };
};

// 防抖
const debounce = (fn, delat) => {
  if (!delat) {
    delat = 300;
  }
  let timer = null;
  return function() {
    const that = this;
    const arg = arguments;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(that, arg);
    }, delat);
  };
};

// 时间戳转换
const formatDate = (time = +new Date()) => {
  const date = new Date(time + 8 * 3600 * 1000);
  return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '-');
};

// 到期时间转换
const expireDate = (time) => {
  const timestamp = new Date().getTime();
  return Math.floor((time - timestamp) / (24 * 3600 * 1000));
};

// 隐藏姓名或者电话
const hiddenName = (str, frontLen, endLen) => { // frontLen保留前N位，endLen保留后N位
  str = str || '';
  const len = str.length - frontLen - endLen;
  let xing = '';
  for (let i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
};

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
const formatTimeTwo = function(timestamp, format) {
  const regYear = new RegExp('(y+)', 'i');

  if (!format) {
    format = 'yyyy-MM-dd hh:mm:ss';
  }
  timestamp = parseInt(timestamp);
  // 通过getDate()方法获取date类型的时间
  const realDate = new Date(timestamp);

  function timeFormat(num) {
    return num < 10 ? '0' + num : num;
  }

  const date = [
    ['M+', timeFormat(realDate.getMonth() + 1)],
    ['d+', timeFormat(realDate.getDate())],
    ['h+', timeFormat(realDate.getHours())],
    ['m+', timeFormat(realDate.getMinutes())],
    ['s+', timeFormat(realDate.getSeconds())],
    ['q+', Math.floor((realDate.getMonth() + 3) / 3)],
    ['S+', realDate.getMilliseconds()]
  ];
  const reg1 = regYear.exec(format);
  // console.log(reg1[0]);
  if (reg1) {
    format = format.replace(reg1[1], (realDate.getFullYear() + '').substring(4 - reg1[1].length));
  }
  for (let i = 0; i < date.length; i++) {
    const k = date[i][0];
    const v = date[i][1];

    const reg2 = new RegExp('(' + k + ')').exec(format);
    if (reg2) {
      format = format.replace(reg2[1], reg2[1].length == 1
        ? v : ('00' + v).substring(('' + v).length));
    }
  }
  return format;
};

// 对象数组排序
/*
* @params:properties=>属性
* @params:order=>顺序 1倒序
* */
const sortArrayObject = (properties, order) => {
  return function(obj, obj1) {
    const value1 = obj[properties];
    const value2 = obj1[properties];
    if (order === 1) return value2 - value1;
    return value1 - value2;// 正序
  };
};
// 深拷贝
const deepCopy = (oldObj, newObj) => {
  for (const key in oldObj) {
    const item = oldObj[key];
    if (item instanceof Array) {
      newObj[key] = [];
      deepCopy(item, newObj[key]);
    } else if (item instanceof Object) {
      newObj[key] = {};
      deepCopy(item, newObj[key]);
    } else {
      newObj[key] = item;
    }
  }
};
// 数组交集
const arrayIntersection = (array1, array2) => {
  const newArray = array1.filter(item => {
    return array2.indexOf(item) !== -1;
  });
  return newArray;
};

export {
  throttle,
  formatDate,
  hiddenName,
  expireDate,
  debounce,
  formatTimeTwo,
  sortArrayObject,
  deepCopy,
  arrayIntersection
};
