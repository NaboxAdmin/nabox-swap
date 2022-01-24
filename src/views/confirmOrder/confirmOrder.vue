<template>
  <div :class="isMobile && 'main-cont_mobile' || ''" class="main-cont">
    <NavBar :back-change="true" :nav-title="$t('navBar.navBar1')" @back="$emit('back')"/>
    <!--    <div class="position-cont_nav" v-if="isMobile"/>-->
    <div v-loading="confirmLoading" class="order-cont">
      <div class="d-flex align-items-center justify-content-center">
        <div v-if="orderInfo" class="coin-icon">
          <img :src="orderInfo.fromAsset.icon || getPicture(orderInfo.fromAsset.symbol)" alt="" @error="pictureError">
        </div>
        <div class="coin-icon">
          <img :src="orderInfo.toAsset.icon || getPicture(orderInfo.toAsset.symbol)" alt="" @error="pictureError">
        </div>
      </div>
      <div v-if="orderInfo" class="order-info">
        <div class="detail-info mt-4">{{ orderInfo && orderInfo.amountIn }} {{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.symbol }}</div>
        <div class="down-icon">
          <svg t="1626399197531" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1100" width="20" height="20"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#31B6A9" p-id="1101"/><path d="M753.408 527.616a36.608 36.608 0 0 0-51.2-3.84l-153.6 132.608V288a36.352 36.352 0 0 0-72.704 0v368.384l-153.6-132.608a36.608 36.608 0 1 0-47.616 55.296l213.76 184.576a41.728 41.728 0 0 0 9.728 5.632h2.048a41.472 41.472 0 0 0 11.264 1.792 41.472 41.472 0 0 0 11.264-1.792h2.048a41.728 41.728 0 0 0 9.728-5.632l213.76-184.576a36.608 36.608 0 0 0 5.12-51.456z" fill="#FFFFFF" p-id="1102"/></svg>
        </div>
        <div class="detail-info mt-2">{{ orderInfo && orderInfo.amountOut | numberFormat }} {{ orderInfo && orderInfo.toAsset && orderInfo.toAsset.symbol }}</div>
      </div>
      <div class="dash_cont"/>
      <div class="order-detail_info">
        <div class="d-flex align-items-center space-between">
          <span class="text-aa">From</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.chain }}</span>
            <span class="ml-4">{{ superLong(orderInfo && orderInfo.address) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">To</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ orderInfo && orderInfo.toAsset && orderInfo.toAsset.chain }}</span>
            <span class="ml-4">{{ superLong(orderInfo && orderInfo.toAddress) }}</span>
          </div>
        </div>
        <!--汇率-->
        <div v-if="orderInfo && orderInfo.currentChannel.swapRate" class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('swap.swap5') }}</span>
          <div class="d-flex align-items-center justify-content-end w-75">
            <span class="ml-4">{{ orderInfo && orderInfo.currentChannel.swapRate }}</span>
          </div>
        </div>
        <!--手续费-->
        <div v-if="orderInfo && orderInfo.currentChannel.crossChainFee" class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('swap.swap6') }}</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="ml-4 text-3a">
              <span>{{ (orderInfo.currentChannel.crossChainFee || '0') | numberFormat }}</span>
              <span>{{ (orderInfo.stableSwap && orderInfo.currentChannel.channel === 'NERVE' && orderInfo.mainAssetSymbol) || (orderInfo.stableSwap && orderInfo.fromAsset.symbol || 'USDT') }}</span>
            </span>
          </div>
        </div>
        <!--swapFee-->
        <div v-if="orderInfo && orderInfo.currentChannel.swapFee" class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('swap.swap43') }}</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="ml-4 text-3a">
              <span>{{ (orderInfo.currentChannel.swapFee || '0') | numberFormat }}</span>
              <span>{{ orderInfo && orderInfo.fromAsset.symbol || 'USDT' }}</span>
            </span>
          </div>
        </div>
        <div class="btn cursor-pointer" @click="confirmOrder">{{ $t('confirmOrder.confirmOrder1') }}</div>
        <!--        <div class="btn cursor-pointer" @click="testStableTransfer">{{ $t('testerrrrr') }}</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar';
import { timesDecimals, getCurrentAccount, Minus } from '@/api/util';
import ISwap from '../Swap/util/iSwap';
import { ISWAP_VERSION, ISWAP_BRIDGE_VERSION } from '../Swap/util/swapConfig';
import { encodeParameters } from '../Swap/util/iSwap';
import Web3 from 'web3';
import Dodo from '../Swap/util/Dodo';
import NerveChannel from '../Swap/util/Nerve';
// import '../../views/Swap/util/stableTransfer-min'

const ethers = require('ethers');

export default {
  name: 'ConfirmOrder',
  components: { NavBar },
  data() {
    return {
      orderInfo: null,
      confirmLoading: false,
      platformAddress: '', // 平台地址
      getAllowanceTimer: null,
      crossInAuth: false,
      swapOrderTimer: null,
      orderTimes: 300000
    };
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    }
  },
  created() {
    this.orderInfo = JSON.parse(sessionStorage.getItem('swapInfo'));
  },
  methods: {
    // async testStableTransfer() {
    //   console.log(window.stableTransfer, 'crossChainFee')
    //   const { fromAddress, fromAsset, toAsset, amountIn, currentChannel } = this.orderInfo;
    //   const res = await window.stableTransfer(fromAddress, fromAsset, toAsset, amountIn, currentChannel.crossChainFee, currentChannel.orderId);
    //   console.log(res, 'ressssss');
    // },
    // 确认订单
    async confirmOrder() {
      try {
        this.confirmLoading = true;
        const { currentChannel, stableSwap } = this.orderInfo;
        switch (currentChannel.channel) {
          case 'iSwap':
            await this.sendISwapTransaction();
            break;
          case 'DODO':
            await this.sendDodoTransaction();
            break;
          case 'NERVE':
            if (stableSwap) {
              await this.sendNerveBridgeTransaction();
            } else {
              await this.sendNerveSwapTransaction();
            }
            break;
          case 'iSwap Bridge':
            await this.sendISwapCrossTransaction();
            break;
          default:
            return false;
        }
      } catch (e) {
        this.confirmLoading = false;
        console.log(e, 'error');
      }
    },
    // 调用合约发送iSwap交易
    async sendISwapTransaction() {
      try {
        const { fromAsset, toAsset, amountIn, currentChannel, toAssetDex, fromAssetDex, stableSwap, crossFeeAsset } = this.orderInfo;
        const config = JSON.parse(sessionStorage.getItem('config'));
        const RPCUrl = config[this.fromNetwork]['apiUrl'];
        const web3 = new Web3(RPCUrl || window.ethereum);
        const fromMainAssetSymbol = config[fromAsset.chain].symbol;
        const toMainAssetSymbol = config[toAsset.chain].symbol;
        const iSwap = new ISwap({
          chain: this.fromNetwork || fromAsset.chain
        });
        const isCross = fromAsset.chain !== toAsset.chain;
        if (isCross) {
        // 稳定币swao
          if (stableSwap) {
            await this.sendISwapCrossTransaction();
          } else {
            const { nativeId, contractAddress } = this.orderInfo.fromAsset;
            const srcPath = currentChannel.inToken.router.map(item => item.address).join(',');
            const destPath = currentChannel.outToken.router.map(item => item.address).join(',');
            const srcChainParams = {
              amount0In: timesDecimals(currentChannel.amount, fromAsset.decimals),
              amount0OutMin: timesDecimals(currentChannel.iSwapConfig.inToken.amountOut, crossFeeAsset.decimals),
              fromAssetDex
            };
            const destChainParams = {
              amount0OutMin: timesDecimals(currentChannel.minReceive, toAsset.decimals),
              fromAddress: this.fromAddress,
              toAssetDex
            };
            const srcChainSwapInfo = encodeParameters(RPCUrl, srcChainParams, 'src');
            const destChainSwapInfo = encodeParameters(RPCUrl, destChainParams, 'dest');
            const params = {
              version: ISWAP_VERSION,
              srcChainId: nativeId,
              destChainId: toAsset.nativeId,
              fromAsset: contractAddress,
              amount: timesDecimals(amountIn, fromAsset.decimals || 18),
              fromUser: this.fromAddress,
              toUser: this.fromAddress,
              gasFee: timesDecimals(currentChannel.outToken.relayerGas, crossFeeAsset && crossFeeAsset.decimals || 18),
              crossChainFee: timesDecimals(currentChannel.originCrossChainFee, crossFeeAsset && crossFeeAsset.decimals || 18),
              rewardsMin: 0,
              channel: 'ISWAP',
              srcPath,
              destPath,
              srcChainSwapInfo,
              destChainSwapInfo,
              isReturnEth: toAsset.symbol === toMainAssetSymbol
            };
            const res = await iSwap.generateCrossChainSwapOrder(params);
            if (res) {
              // 先存到nabox后台
              const swapRes = await this.recordSwapOrder(res, 1);
              if (swapRes.code === 1000) {
                const dstChainId = toAsset.nativeId;
                const orderId = (res.orderId).toString();
                const crossChainFee = this.numberFormat((res.crossChainFee).toString());
                const gasFee = this.numberFormat((res.gasFee).toString());
                const channel = this.formatBytes32(web3.utils.fromAscii(res.channel));
                const srcChainSwapCallData = this.formatBytes(res.srcChainSwapInfo);
                const dstChainSwapInfo = this.formatBytes(res.destChainSwapInfo);
                const srcPathArr = res.srcPath.split(',');
                let transferResult;
                if (fromAsset.symbol === fromMainAssetSymbol) {
                  transferResult = await iSwap._swapExactETHForTokensSupportingFeeOnTransferTokensCrossChain(this.fromAddress, orderId, gasFee, crossChainFee, dstChainId, channel, srcPathArr, srcChainSwapCallData, dstChainSwapInfo, this.orderInfo);
                } else {
                  transferResult = await iSwap._swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain(this.fromAddress, orderId, gasFee, crossChainFee, dstChainId, channel, srcPathArr, srcChainSwapCallData, dstChainSwapInfo);
                }
                if (transferResult.hash) {
                  this.$message({
                    type: 'success',
                    message: this.$t('tips.tips24'),
                    offset: 30,
                    duration: 1500
                  });
                  this.confirmLoading = false;
                  this.$emit('confirm');
                  await this.recordHash(res.orderId, transferResult.hash);
                }
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                });
                this.confirmLoading = false;
              }
            }
          }
        } else {
          const { currentChannel, toAddress, toAssetDex, currentDex } = this.orderInfo;
          const paths = currentChannel.router.map(item => item.address);
          const deadTimes = 30;
          const channelBytes32 = this.formatBytes32(web3.utils.fromAscii(currentChannel.channel));
          const amountIn = timesDecimals(this.orderInfo.amountIn, fromAsset.decimals);
          const amountOutMin = timesDecimals(currentChannel.minReceive, toAsset.decimals);
          const deadline = Math.floor((Date.now() + 1000 * 60 * deadTimes) / 1000);
          let transferResult;
          if (fromAsset.symbol === fromMainAssetSymbol) {
            transferResult = await iSwap._swapExactETHForTokensSupportingFeeOnTransferTokens(this.fromAddress, currentDex.routerAddress, amountOutMin, paths, toAddress, deadline, channelBytes32, this.orderInfo);
          } else if (toAsset.symbol === fromMainAssetSymbol) {
            transferResult = await iSwap._swapExactTokensForETHSupportingFeeOnTransferTokens(this.fromAddress, toAssetDex.routerAddress, amountIn, amountOutMin, paths, toAddress, deadline, channelBytes32);
          } else {
            transferResult = await iSwap._swapExactTokensForTokensSupportingFeeOnTransferTokens(this.fromAddress, toAssetDex.routerAddress, amountIn, amountOutMin, paths, toAddress, deadline, channelBytes32);
          }
          if (transferResult.hash) {
            this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: transferResult.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
            this.$message({
              type: 'success',
              message: this.$t('tips.tips24'),
              offset: 30,
              duration: 1500
            });
            this.confirmLoading = false;
            this.$emit('confirm');
          }
        }
      } catch (e) {
        console.log(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: e.message,
          offset: 30
        });
      }
    },
    // 调用合约发送iSwapCross交易
    async sendISwapCrossTransaction() {
      try {
        const { fromAsset, toAsset, address, toAddress, amountIn, currentChannel } = this.orderInfo;
        const config = JSON.parse(sessionStorage.getItem('config'));
        const fromMainAssetSymbol = config[fromAsset.chain].symbol;
        const toMainAssetSymbol = config[toAsset.chain].symbol;
        const iSwap = new ISwap({
          chain: this.fromNetwork || fromAsset.chain
        });
        const params = {
          version: ISWAP_BRIDGE_VERSION,
          fromUser: address,
          toUser: toAddress,
          srcChainId: fromAsset.nativeId,
          destChainId: toAsset.nativeId,
          fromAsset: fromAsset.contractAddress,
          amount: timesDecimals(amountIn, fromAsset.decimals || 18),
          gasFee: currentChannel.iSwapConfig.gasFee,
          crossChainFee: currentChannel.iSwapConfig.crossChainFee,
          rewardsMin: 0,
          type: (Minus(amountIn, 10000) > 0 || Minus(amountIn, 10000) === 0) && 2 || 1,
          deadline: 2524579200,
          isReturnEth: toAsset.symbol === toMainAssetSymbol,
          channel: 'ISWAP'
        };
        const res = await iSwap.generateCrossChainBridgeOrder(params);
        if (res) {
          const swapRes = await this.recordSwapOrder(res, (Minus(amountIn, 10000) > 0 || Minus(amountIn, 10000) === 0) && 3 || 2);
          let transferResult;
          if (swapRes.code === 1000) {
            if (fromMainAssetSymbol === fromAsset.symbol) {
              transferResult = await iSwap._crossChainETH(this.fromAddress, res.encodeData, this.orderInfo);
            } else {
              transferResult = await iSwap._crossChainToken(this.fromAddress, res.encodeData);
            }
            if (transferResult.hash) {
              this.$message({
                type: 'success',
                message: this.$t('tips.tips24'),
                offset: 30,
                duration: 1500
              });
              this.confirmLoading = false;
              this.$emit('confirm');
              await this.recordHash(res.orderId, transferResult.hash);
            }
          } else {
            throw swapRes.msg;
          }
        }
      } catch (e) {
        console.log(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: e.message || e,
          offset: 30
        });
      }
    },
    // 调用合约发送DODO交易
    async sendDodoTransaction() {
      try {
        const dodo = new Dodo();
        const transactionRes = await dodo.sendDodoTransaction(this.orderInfo);
        if (transactionRes.hash) {
          this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: transactionRes.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            type: 'success',
            message: this.$t('tips.tips24'),
            offset: 30,
            duration: 1500
          });
          this.confirmLoading = false;
          this.$emit('confirm');
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: e.message,
          offset: 30
        });
      }
    },
    // 发送nerveSwap交易
    async sendNerveSwapTransaction() {
      try {
        const { toAsset, fromAsset, currentChannel } = this.orderInfo;
        const NerveChannel = new NerveChannel({
          chooseToAsset: toAsset,
          chooseFromAsset: fromAsset
        });
        const res = await NerveChannel.sendNerveSwapTransaction(currentChannel, this.fromAddress);
        if (res.hash) {
          this.formatArrayLength('NERVE', { type: 'L2', isPure: true, userAddress: this.fromAddress, chain: 'NERVE', txHash: res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            type: 'success',
            message: this.$t('tips.tips24'),
            offset: 30,
            duration: 1500
          });
          this.confirmLoading = false;
          this.$emit('confirm');
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: e.message,
          offset: 30
        });
      }
    },
    // 发送nerve稳定币兑换交易
    async sendNerveBridgeTransaction() {
      try {
        const configRes = await this.$request({
          method: 'get',
          url: '/api/common/config'
        });
        let swapNerveAddress;
        if (configRes.code === 1000) {
          swapNerveAddress = configRes.data.swapNerveAddress;
        }
        const config = JSON.parse(sessionStorage.getItem('config'));
        const multySignAddress = config[this.fromNetwork]['config']['crossAddress'] || '';
        const { toAsset, fromAsset, currentChannel, amountIn } = this.orderInfo;
        console.log(fromAsset, amountIn, 'amountIn 213');
        const nerveChannel = new NerveChannel({
          chooseToAsset: toAsset,
          chooseFromAsset: fromAsset
        });
        const params = {
          fromAddress: this.fromAddress,
          decimals: fromAsset.decimals,
          contractAddress: fromAsset.contractAddress,
          orderId: ethers.utils.toUtf8Bytes(currentChannel.orderId),
          numbers: amountIn,
          multySignAddress,
          crossChainFee: currentChannel.crossChainFee,
          nerveAddress: swapNerveAddress
        };
        console.log(params, 'params');
        const swapRes = await this.recordSwapOrder({ orderId: currentChannel.orderId }, 2);
        if (swapRes.code === 1000) {
          let res;
          if (this.fromNetwork !== 'NERVE') {
            res = await nerveChannel.sendNerveBridgeTransaction(params);
          } else {
            // const { amountIn } = this.orderInfo.fromAsset;
            const crossOutPrams = {
              from: this.fromAddress,
              chainId: fromAsset.nerveChainId,
              assetId: fromAsset.nerveAssetId,
              amountIn: timesDecimals(amountIn, fromAsset.decimals),
              type: 2,
              pub: this.currentAccount.pub,
              signAddress: this.currentAccount.address.Ethereum,
              crossAddress: swapNerveAddress,
              currentAccount: this.currentAccount,
              fee: currentChannel.crossChainFee,
              orderId: currentChannel.orderId
            };
            console.log(crossOutPrams, 'crossOutPrams');
            res = await nerveChannel.sendNerveCommonTransaction(crossOutPrams);
          }
          if (res.hash) {
            this.$message({
              type: 'success',
              message: this.$t('tips.tips24'),
              offset: 30,
              duration: 1500
            });
            this.confirmLoading = false;
            this.$emit('confirm');
            await this.recordHash(currentChannel.orderId, res.hash);
          }
        } else {
          throw swapRes.msg;
        }
      } catch (e) {
        console.log(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: e.message || e,
          offset: 30
        });
      }
    },
    // 记录一次交易hash
    async recordHash(orderId, hash) {
      const params = {
        orderId,
        txHash: hash
      };
      await this.$request({
        url: '/swap/tx/hash/update',
        data: params
      });
    },
    // 记录到nabox后台
    async recordSwapOrder(res, type) {
      const { fromAsset, toAsset, amountIn, currentChannel, address, toAddress, slippage, stableSwap } = this.orderInfo;
      const naboxParams = {
        orderId: res.orderId,
        channel: currentChannel.channel,
        platform: 'NABOX',
        fromChain: fromAsset.chain,
        toChain: toAsset.chain,
        fromAddress: address,
        toAddress: toAddress,
        chainId: fromAsset.chainId,
        assetId: fromAsset.assetId,
        contractAddress: fromAsset.contractAddress || '',
        swapChainId: toAsset.chainId,
        swapAssetId: toAsset.assetId,
        swapContractAddress: toAsset.contractAddress || '',
        // amount: timesDecimals(amountIn, fromAsset.decimals || 18),
        amount: amountIn,
        // fee: currentChannel.channel === 'NERVE' ? currentChannel.originCrossChainFee : currentChannel.crossChainFee,
        crossFee: currentChannel.channel === 'NERVE' ? currentChannel.crossChainFee : currentChannel.crossChainFee,
        swapFee: currentChannel.swapFee,
        slippage: currentChannel.channel === 'NERVE' && stableSwap ? '0' : slippage,
        pairAddress: fromAsset.channelInfo && fromAsset.channelInfo['NERVE'] && fromAsset.channelInfo['NERVE'].pairAddress || '',
        // swapSuccAmount: timesDecimals(currentChannel.amountOut, toAsset.decimals || 18),
        swapSuccAmount: currentChannel.amountOut,
        swapType: type
      };
      return await this.$request({
        url: '/swap/cross/tx/save',
        data: naboxParams
      });
    },
    // byte32格式化
    formatBytes32(byte32String) {
      const strLength = byte32String.length;
      const differenceLength = strLength - 66;
      if (differenceLength > 0) {
        return byte32String.slice(0, 66);
      } else {
        return byte32String.padEnd(66, '0');
      }
    },
    // format '0x'
    formatBytes(str) {
      if (str.startsWith('0x')) {
        return str;
      }
      return '0x' + str;
    }
  }
};
</script>

<style scoped lang="scss">
@import "confirmOrder.scss";
.w-75 {
  width: 85%;
  text-align: right;
}
</style>
