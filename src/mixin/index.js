import { superLong, divisionDecimals, timesDecimals, tofix } from '@/api/util';
import moment from 'moment';
import { Division, Minus } from '../api/util';

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
      const tempNum = tofix(val.toString(), 2);
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
        return tofix(val, 2, -1);
      } else if (Minus(val, k) >= 0 && Minus(val, m) < 0) {
        return `${tofix(Division(val, k), 2, -1)}K`;
      } else if (Minus(val, m) > 0) {
        return `${tofix(Division(val, m), 2, -1)}M`;
      } else {
        return '0.00';
      }
    }
  },
  methods: {
    getPicture(suffix) {
      const baseUrl = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/';
      return `${baseUrl}${suffix}.png`;
    },
    pictureError(e) {
      e.target.src = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULL.png';
    },
    superLong(str, len = 5) {
      return superLong(str, len);
    },
    formatTime(time) {
      const date = new Date(time.replace(/-/g, '/')); // 兼容iOS
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
    }
  }
};
