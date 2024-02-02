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
        <div class="detail-info mt-4">{{ orderInfo && orderInfo.amountIn | numberFormat }} {{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.symbol }}</div>
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
            <span v-if="orderInfo && orderInfo.fromAsset.chain==='NERVE' && orderInfo.toAsset.chain==='NULS'">
              {{ `${crossFee}NVT+${crossFee}NULS` }}
            </span>
            <span v-else-if="orderInfo && orderInfo.currentChannel.dex === 'Bridgers' || orderInfo.currentChannel.dex === 'Aggregator'">{{ orderInfo && orderInfo.currentChannel.crossChainFee | numberFormat }}{{ orderInfo && orderInfo.toAsset.symbol }}</span>
            <span v-else-if="orderInfo && orderInfo.currentChannel.dex === 'SWFT'">{{ orderInfo && orderInfo.currentChannel.crossChainFee | numberFormat }}{{ orderInfo && orderInfo.toAsset.symbol }}</span>
            <span v-else class="ml-4 text-3a">
              <span>{{ (orderInfo.currentChannel.crossChainFee || '0') | numberFormat }}</span>
              <span>{{ (orderInfo.stableSwap && orderInfo.currentChannel.channel === 'NERVE' && orderInfo.mainAssetSymbol) || (orderInfo.stableSwap && orderInfo.fromAsset.symbol || orderInfo.mainAssetSymbol) }}</span>
            </span>
          </div>
        </div>
        <!--swapFee-->
        <div v-if="orderInfo && orderInfo.currentChannel.swapFee" class="d-flex align-items-center space-between mt-4">
          <span class="text-aa">{{ $t('swap.swap43') }}</span>
          <div class="d-flex align-items-center justify-content-end">
            <span v-if="orderInfo && orderInfo.currentChannel.dex === 'SWFT'" class="text-3a">{{ orderInfo && orderInfo.currentChannel.swapFee | numberFormat }}{{ orderInfo && orderInfo.fromAsset.symbol || orderInfo && orderInfo.currentChannel.feeSymbol || 'USDT' }}</span>
            <span v-else-if="orderInfo && orderInfo.currentChannel.dex === 'Bridgers' || orderInfo.currentChannel.dex === 'Aggregator'" class="text-3a">{{ orderInfo && orderInfo.currentChannel.swapFee }}{{ orderInfo && orderInfo.fromAsset.symbol }}</span>
            <span v-else class="ml-4 text-3a">
              <span>{{ (orderInfo.currentChannel.swapFee || '0') | numberFormat }}</span>
              <span>{{ orderInfo && (orderInfo.currentChannel.feeSymbol || orderInfo.fromAsset.symbol || 'USDT') }}</span>
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
import { timesDecimals, Division } from '@/api/util';
import Dodo from '../Swap/util/Dodo';
import NerveChannel, { senENULSTransaction } from '../Swap/util/Nerve';
import { NTransfer, crossFee } from '@/api/api';
import { getEquipmentNo, metaPathRecordHash, sendMetaPathTransaction } from '@/views/Swap/util/MetaPath';
import Inch from '@/views/Swap/util/1inch';
import OKXChannel from "@/views/Swap/util/OKX";
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
      orderTimes: 300000,
      crossFee,
      currentOrderId: ''
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
    // 确认订单
    async confirmOrder() {
      try {
        this.confirmLoading = true;
        const { currentChannel, stableSwap, nerveChainStableSwap, nerveCrossSwap, toAsset } = this.orderInfo;
        // console.log(currentChannel, 'stableSwap')
        switch (currentChannel.originalChannel) {
          case 'DODO':
            await this.sendDodoTransaction();
            break;
          case 'NERVE':
            if (stableSwap && nerveChainStableSwap) {
              await this.sendNerveStableSwapTransaction();
            } else if (stableSwap) {
              await this.sendNerveBridgeTransaction();
            } else if (!this.stableSwap && nerveCrossSwap && this.fromNetwork !== 'NERVE' || this.fromNetwork === 'NERVE' && !this.stableSwap && toAsset.chain !== 'NERVE') {
              await this.sendNerveBridgeTransaction(1); // 非稳定币跨链传1
            } else if (currentChannel.packSwap) {
              await this.sendENULSSwapTransaction();
            } else {
              await this.sendNerveSwapTransaction();
            }
            break;
          case 'MetaPath':
            await this._sendMetaPathCrossTransaction();
            break;
          case '1inch':
            await this._send1inchTransaction();
            break;
          case 'OKX':
            await this._sendOKXTransaction();
            break;
          default:
            return false;
        }
      } catch (e) {
        this.confirmLoading = false;
        console.log(e, 'error');
      }
    },
    async _sendMetaPathCrossTransaction() {
      try {
        const { address, fromAsset, toAsset, toAddress, currentChannel, slippage } = this.orderInfo;
        const recordParams = {
          equipmentNo: getEquipmentNo(this.fromAddress),
          fromTokenAddress: fromAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          toTokenAddress: toAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          fromAddress: address,
          toAddress,
          fromTokenAmount: timesDecimals(currentChannel.amount || 0, fromAsset.decimals || 18),
          slippage,
          fromChain: fromAsset['channelInfo']['MetaPath']['chain'],
          toChain: toAsset['channelInfo']['MetaPath']['chain'],
          toTokenAmount: currentChannel.amountOut,
          dexName: currentChannel.dex,
          orderId: currentChannel.txData && currentChannel.txData.orderId || '',
          orderType: currentChannel.txData && currentChannel.txData.orderType || '',
          transferData: currentChannel.txData && currentChannel.txData.transferData || '',
          source: 'swapbox'
        };
        if (fromAsset.chain !== toAsset.chain) {
          const swapRes = await this.recordSwapOrder({ orderId: currentChannel.orderId }, 1);
          if (swapRes.code === 1000) {
            const transactionRes = await sendMetaPathTransaction(this.orderInfo);
            if (transactionRes.hash) {
              fromAsset.chain === toAsset.chain && this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: transactionRes.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
              recordParams['hash'] = transactionRes.hash;
              const res = await metaPathRecordHash(recordParams);
              if (res.resCode == '100') {
                this.$message({
                  type: 'success',
                  message: this.$t('tips.tips24'),
                  offset: 30,
                  duration: 1500
                });
                this.confirmLoading = false;
                this.$emit('confirm');
                await this.recordHash(currentChannel.orderId, transactionRes.hash);
              }
            }
          } else {
            throw swapRes.data;
          }
        } else {
          const res = await this.recordSameChainOrder();
          if (res && res.code == 1000) {
            const transactionRes = await sendMetaPathTransaction(this.orderInfo);
            if (transactionRes.hash) {
              this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: transactionRes.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
              recordParams['hash'] = transactionRes.hash;
              const res = await metaPathRecordHash(recordParams);
              if (res.resCode == '100') {
                this.$message({
                  type: 'success',
                  message: this.$t('tips.tips24'),
                  offset: 30,
                  duration: 1500
                });
                this.confirmLoading = false;
                this.$emit('confirm');
                await this.recordSameChainHash(currentChannel.orderId, transactionRes.hash);
              }
            }
          }
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30
        });
      }
    },
    // 调用合约发送DODO交易
    async sendDodoTransaction() {
      try {
        const res = await this.recordSameChainOrder();
        if (res && res.code == 1000) {
          this.currentOrderId = res.data && res.data.orderId || '';
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
            await this.recordSameChainHash(this.currentOrderId, transactionRes.hash);
          }
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30
        });
      }
    },
    async _sendOKXTransaction() {
      try {
        const res = await this.recordSameChainOrder();
        if (res && res.code == 1000) {
          this.currentOrderId = res.data && res.data.orderId || '';
          const { fromAsset, toAsset, amountIn, address, slippage } = this.orderInfo;
          const params = {
            chainId: this.nativeId,
            fromTokenAddress: fromAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            toTokenAddress: toAsset.contractAddress || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            amount: timesDecimals(amountIn, fromAsset.decimals || 18),
            userWalletAddress: address,
            slippage: Division(slippage, 100).toString(),
            referrerAddress: '0xDDE4259700E27872e6A631B5361243139f5dB7b8',
            feePercent: 0.1
          };
          const oxk = new OKXChannel();
          const txRes = await oxk.sendOKXTransaction(params, fromAsset);
          if (txRes && txRes.hash) {
            this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: txRes.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
            this.$message({
              type: 'success',
              message: this.$t('tips.tips24'),
              offset: 30,
              duration: 1500
            });
            this.confirmLoading = false;
            this.$emit('confirm');
            await this.recordSameChainHash(this.currentOrderId, txRes.hash);
          } else {
            throw txRes.msg;
          }
        } else {
          throw res.msg;
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: 'OKX router error:' + this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e)
        });
      }
    },
    async _send1inchTransaction() {
      try {
        const res = await this.recordSameChainOrder();
        if (res && res.code == 1000) {
          this.currentOrderId = res.data && res.data.orderId || '';
          const inch = await new Inch({ nativeId: this.nativeId });
          const { fromAsset, toAsset, amountIn, address, slippage } = this.orderInfo;
          const params = {
            src: fromAsset.contractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            dst: toAsset.contractAddress || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            amount: timesDecimals(amountIn, fromAsset.decimals || 18),
            from: address,
            slippage,
            referrer: '0xDDE4259700E27872e6A631B5361243139f5dB7b8',
            fee: 0.1
          };
          const txRes = await inch.send1inchTransaction(params, address);
          if (txRes && txRes.hash) {
            this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: txRes.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
            this.$message({
              type: 'success',
              message: this.$t('tips.tips24'),
              offset: 30,
              duration: 1500
            });
            this.confirmLoading = false;
            this.$emit('confirm');
            await this.recordSameChainHash(this.currentOrderId, txRes.hash);
          } else {
            throw txRes.msg;
          }
        }
      } catch (e) {
        console.error(e);
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: '1inch router error:' + this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e)
        });
      }
    },
    async sendENULSSwapTransaction() {
      try {
        const res = await this.recordSameChainOrder();
        if (res && res.code === 1000) {
          const { currentChannel, fromAsset } = this.orderInfo;
          this.currentOrderId = res.data && res.data.orderId || '';
          const txRes = await senENULSTransaction({
            value: currentChannel.amount,
            token0: currentChannel.token0,
            token1: currentChannel.token1,
            fromAsset
          });
          if (txRes.hash) {
            this.formatArrayLength(this.fromNetwork, { type: 'L1', userAddress: this.fromAddress, chain: this.fromNetwork, txHash: txRes.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
            this.$message({
              type: 'success',
              message: this.$t('tips.tips24'),
              offset: 30,
              duration: 1500
            });
            this.confirmLoading = false;
            this.$emit('confirm');
            await this.recordSameChainHash(this.currentOrderId, txRes.hash);
          }
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30
        });
      }
    },
    // 发送nerveSwap交易
    async sendNerveSwapTransaction() {
      try {
        const { toAsset, fromAsset, currentChannel, swapPairInfo, swapPairTradeList, tokenPath, isFromMultiChainRouter, isToMultiChainRouter } = this.orderInfo;
        const nerveChannel = new NerveChannel({
          chooseToAsset: toAsset,
          chooseFromAsset: fromAsset,
          swapPairInfo,
          swapPairTradeList,
          tokenPath,
          isFromMultiChainRouter,
          isToMultiChainRouter
        });
        const tAssemble = await nerveChannel.sendNerveSwapTransaction(currentChannel, this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId], swapPairTradeList);
        const transfer = new NTransfer({ chain: 'NERVE' });
        const txHex = await transfer.getTxHex({
          tAssemble,
          pub: this.currentAccount.pub,
          signAddress: this.currentAccount.address['Ethereum'] || this.currentAccount.address[1] || this.currentAccount['address'][97]
        });
        console.log(txHex, '===txHex===');
        const res = await nerveChannel.broadcastHex(txHex, this.fromNetwork);
        if (res && res.hash) {
          this.formatArrayLength('NERVE', { type: 'L2', isPure: true, userAddress: this.fromAddress, chain: 'NERVE', txHash: res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            type: 'success',
            message: this.$t('tips.tips24'),
            offset: 30,
            duration: 1500
          });
          this.confirmLoading = false;
          this.$emit('confirm');
        } else {
          throw res.msg;
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30
        });
      }
    },
    // 发送nerve链上稳定币交易
    async sendNerveStableSwapTransaction() {
      try {
        const { toAsset, fromAsset, currentChannel, swapPairInfo, swapPairTradeList, tokenOutIndex, tokenIndexList = [], isFromLpAsset = false, isToLpAsset = false } = this.orderInfo;
        const nerveChannel = new NerveChannel({
          chooseToAsset: toAsset,
          chooseFromAsset: fromAsset,
          swapPairInfo,
          swapPairTradeList
        });
        const tAssemble = await nerveChannel.sendNerveStableSwapTransaction(currentChannel.amount, this.currentAccount['address']['NERVE'], tokenOutIndex, isFromLpAsset, isToLpAsset, tokenIndexList);
        const transfer = new NTransfer({ chain: 'NERVE' });
        const txHex = await transfer.getTxHex({
          tAssemble,
          pub: this.currentAccount.pub,
          signAddress: this.currentAccount.address['Ethereum'] || this.currentAccount.address[1] || this.currentAccount['address'][97]
        });
        console.log(txHex, '===txHex===');
        const res = await nerveChannel.broadcastHex(txHex, this.fromNetwork);
        if (res && res.hash) {
          this.formatArrayLength('NERVE', { type: 'L2', isPure: true, userAddress: this.fromAddress, chain: 'NERVE', txHash: res.hash, status: 0, createTime: this.formatTime(+new Date(), false), createTimes: +new Date() });
          this.$message({
            type: 'success',
            message: this.$t('tips.tips24'),
            offset: 30,
            duration: 1500
          });
          this.confirmLoading = false;
          this.$emit('confirm');
        } else {
          this.$message({
            type: 'warning',
            message: res.msg || this.$t('tips.tips51'),
            offset: 30
          });
          this.confirmLoading = false;
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        this.$message({
          type: 'warning',
          message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
          offset: 30
        });
      }
    }, // Cannot read properties of undefined (reading 'toHexString')
    // 发送nerve稳定币兑换交易
    async sendNerveBridgeTransaction(type) {
      try {
        const configRes = await this.$request({
          method: 'get',
          url: '/api/common/config'
        });
        let swapNerveAddress, swapNulsAddress;
        if (configRes.code === 1000) {
          swapNerveAddress = configRes.data.swapNerveAddress;
          swapNulsAddress = configRes.data.swapNulsAddress;
        }
        const config = JSON.parse(sessionStorage.getItem('config'));
        const multySignAddress = config[this.fromNetwork]['config']['crossAddress'] || '';
        const { toAsset, fromAsset, currentChannel, amountIn, NULSContractGas, NULSContractTxData, isBridge } = this.orderInfo;
        const nerveChannel = new NerveChannel({
          chooseToAsset: toAsset,
          chooseFromAsset: fromAsset
        });
        const params = {
          fromAddress: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
          decimals: fromAsset.decimals,
          contractAddress: fromAsset.contractAddress,
          orderId: ethers.utils.toUtf8Bytes(`${currentChannel.orderId}---NABOX`),
          numbers: amountIn,
          multySignAddress,
          crossChainFee: currentChannel.crossChainFee,
          nerveAddress: swapNerveAddress,
          fromNetwork: this.fromNetwork
        };
        const swapRes = await this.recordSwapOrder({ orderId: currentChannel.orderId }, type || isBridge && 3 || 2);
        if (swapRes.code === 1000) {
          let res;
          if (this.chainType === 2) { // 异构链转到中间账户
            res = await nerveChannel.sendNerveBridgeTransaction(params);
          } else if (this.chainType === 1) {
            // const { amountIn } = this.orderInfo.fromAsset;
            const crossOutPrams = {
              from: this.currentAccount['address'][this.fromNetwork] || this.currentAccount['address'][this.nativeId],
              chainId: fromAsset.nerveChainId,
              assetId: fromAsset.nerveAssetId,
              amountIn: timesDecimals(amountIn, fromAsset.decimals),
              type: 2,
              pub: this.currentAccount.pub,
              signAddress: this.currentAccount.address['Ethereum'] || this.currentAccount.address[1] || this.currentAccount['address'][97],
              swapNerveAddress: swapNerveAddress,
              swapNulsAddress: swapNulsAddress,
              currentAccount: this.currentAccount,
              fee: currentChannel.crossChainFee,
              orderId: currentChannel.orderId,
              fromNetwork: this.fromNetwork,
              toNetwork: toAsset.chain,
              fromAsset,
              NULSContractGas,
              NULSContractTxData,
              currentChannel,
              nativeId: this.chainNameToId[this.fromNetwork]
            };
            res = await nerveChannel.sendNerveCommonTransaction(crossOutPrams);
          } else if (this.chainType === 3) {
            res = await nerveChannel.sendNerveBridgeTransaction(params);
          }
          if (res && res.hash) {
            const params = {
              orderId: currentChannel.orderId,
              txHash: res.hash,
              type: 'swap'
            };
            const hashList = localStorage.getItem('hashList') && JSON.parse(localStorage.getItem('hashList')) || [];
            hashList.push(params);
            localStorage.setItem('hashList', JSON.stringify(hashList));
            this.$message({
              type: 'success',
              message: this.$t('tips.tips24'),
              offset: 30,
              duration: 1500
            });
            this.confirmLoading = false;
            this.$emit('confirm');
            await this.recordHash(currentChannel.orderId, res.hash);
          } else {
            this.confirmLoading = false;
            this.$message({
              type: 'warning',
              message: this.errorHandling(res.data || res.msg),
              offset: 30
            });
          }
        } else {
          this.confirmLoading = false;
          this.$message({
            type: 'warning',
            message: this.errorHandling(swapRes.data || swapRes.msg),
            offset: 30
          });
        }
      } catch (e) {
        console.error(e, 'error');
        this.confirmLoading = false;
        // @fixme 兼容防止抛出下面的错误取消了订单
        // Cannot read properties of undefined (reading 'toHexString')
        if (this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e).indexOf("reading 'toHexString'") === -1) {
          this.$message({
            type: 'warning',
            message: this.errorHandling(e.data && e.data.message || e.value && e.value.message || e.message || e),
            offset: 30
          });
          await this.deleteOrder();
        } else {
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
    },
    async deleteOrder() {
      try {
        const { currentChannel } = this.orderInfo;
        const data = {
          orderId: currentChannel && currentChannel.orderId
        };
        await this.$request({
          url: '/swap/tx/delete',
          data
        });
      } catch (e) {
        console.error('Failed: ', e);
      }
    },
    // 记录一次交易hash
    async recordHash(orderId, hash) {
      try {
        const params = {
          orderId,
          txHash: hash
        };
        await this.$request({
          url: '/swap/tx/hash/update',
          data: params
        });
      } catch (e) {
        console.log(e, 'error');
      }
    },
    // 记录一次交易hash
    async recordSameChainHash(orderId, hash) {
      try {
        const params = {
          orderId,
          txHash: hash
        };
        await this.$request({
          url: '/swap/hash/update',
          data: params
        });
      } catch (e) {
        console.log(e, 'error');
      }
    },
    // 记录到nabox后台
    async recordSwapOrder(res, type) {
      const { fromAsset, toAsset, amountIn, currentChannel, address, toAddress, slippage, stableSwap } = this.orderInfo;
      const { platform } = this.$route.query;
      const naboxParams = {
        orderId: res.orderId,
        channel: currentChannel.originalChannel || currentChannel.channel,
        // platform: '',
        platform: platform || 'uni',
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
        amount: amountIn,
        crossFee: this.fromNetwork === 'NULS' ? currentChannel.originCrossChainFee : (currentChannel.dex === 'SWFT' || currentChannel.dex === 'Bridgers' || currentChannel.dex === 'Aggregator') && `${currentChannel.crossChainFee}${toAsset.symbol}` || currentChannel.crossChainFee,
        swapFee: (currentChannel.dex === 'SWFT' || currentChannel.dex === 'Bridgers' || currentChannel.dex === 'Aggregator') && `${currentChannel.swapFee}${fromAsset.symbol}` || currentChannel.swapFee,
        slippage: currentChannel.channel === 'NERVE' && stableSwap ? '0' : slippage,
        pairAddress: fromAsset.channelInfo && fromAsset.channelInfo['NERVE'] && fromAsset.channelInfo['NERVE'].pairAddress || '',
        // swapSuccAmount: timesDecimals(currentChannel.amountOut, toAsset.decimals || 18),
        swapSuccAmount: currentChannel.channel === 'NERVE' && type == 1 ? currentChannel.minReceive : currentChannel.amountOut,
        swapType: type
      };
      return await this.$request({
        url: '/swap/cross/tx/save',
        data: naboxParams
      });
    },
    // 存储本链交易
    async recordSameChainOrder() {
      const { fromAsset, toAsset, amountIn, currentChannel, address, slippage } = this.orderInfo;
      const params = {
        orderId: '',
        channel: currentChannel.originalChannel || currentChannel.channel,
        swapType: '1',
        chain: this.fromNetwork,
        address,
        chainId: fromAsset.chainId,
        assetId: fromAsset.assetId,
        contractAddress: fromAsset.contractAddress || '',
        swapChainId: toAsset.chainId,
        swapAssetId: toAsset.assetId,
        swapContractAddress: toAsset.contractAddress,
        amount: amountIn,
        swapSuccAmount: currentChannel.amountOut,
        swapFee: currentChannel.swapFee || 0,
        slippage,
        pairAddress: ''
      };
      return await this.$request({
        url: '/swap/tx/save',
        data: params
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
