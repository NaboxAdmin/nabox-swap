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
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">To</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ orderInfo && orderInfo.toAsset && orderInfo.toAsset.chain }}</span>
            <span class="ml-4">{{ superLong(orderInfo && orderInfo.toAddress) }}</span>
          </div>
        </div>
        <!--汇率-->
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">{{ $t('swap.swap5') }}</span>
          <div class="d-flex align-items-center justify-content-end w-75">
            <span class="ml-4">{{ orderInfo && orderInfo.currentChannel.swapRate }}</span>
          </div>
        </div>
        <!--手续费-->
        <div v-if="orderInfo && orderInfo.currentChannel.crossChainFee" class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">{{ $t('swap.swap6') }}</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="ml-4 text-3a">
              <span>{{ orderInfo.currentChannel.crossChainFee || '0' }}</span>
              <span>{{ orderInfo.fromAsset && orderInfo.fromAsset.symbol }}</span>
            </span>
          </div>
        </div>
        <div class="btn cursor-pointer" @click="confirmOrder">{{ $t('confirmOrder.confirmOrder1') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar';
import { MAIN_INFO, NULS_INFO } from '@/config';
import { timesDecimals, getCurrentAccount } from '@/api/util';
import { ETransfer, NTransfer } from '@/api/api';
import ISwap from '../Swap/util/iSwap';
import { ISWAP_VERSION } from '../Swap/util/swapConfig';
import { encodeParameters } from '../Swap/util/iSwap';
import Web3 from 'web3';
import Dodo from '../Swap/util/Dodo';
import NerveChannel from '../Swap/util/Nerve';

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
    // 确认订单
    async confirmOrder() {
      try {
        this.confirmLoading = true;
        const { currentChannel } = this.orderInfo;
        switch (currentChannel.channel) {
          case 'iSwap':
            await this.sendISwapTransaction();
            break;
          case 'DODO':
            await this.sendDodoTransaction();
            break;
          case 'Nerve':
            await this.sendNerveSwapTransaction();
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
        const { fromAsset, toAsset, amountIn, currentChannel, toAssetDex, fromAssetDex, address, toAddress, slippage } = this.orderInfo;
        const config = JSON.parse(sessionStorage.getItem('config'));
        const RPCUrl = config[this.fromNetwork]['apiUrl'];
        const web3 = new Web3(RPCUrl || window.ethereum);
        const fromMainAssetSymbol = config[fromAsset.chain].symbol;
        const iSwap = new ISwap({
          chain: this.fromNetwork || fromAsset.chain
        });
        const isCross = fromAsset.chain !== toAsset.chain;
        if (isCross) {
          const { nativeId, contractAddress } = this.orderInfo.fromAsset;
          const srcPath = currentChannel.inToken.router.map(item => item.address).join(',');
          const destPath = currentChannel.outToken.router.map(item => item.address).join(',');
          const srcChainParams = {
            amount0In: timesDecimals(currentChannel.amount, fromAsset.decimals),
            amount0OutMin: timesDecimals(currentChannel.minReceive, toAsset.decimals),
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
            gasFee: timesDecimals(currentChannel.outToken.relayerGas, fromAsset.decimals || 18),
            crossChainFee: timesDecimals(currentChannel.originCrossChainFee, fromAsset.decimals || 18),
            rewardsMin: 0,
            channel: 'ISWAP',
            srcPath,
            destPath,
            srcChainSwapInfo,
            destChainSwapInfo,
            isReturnEth: false
          };
          const res = await iSwap.generateCrossChainSwapOrder(params);
          if (res) {
            // 先存到nabox后台
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
              amount: timesDecimals(amountIn, fromAsset.decimals || 18),
              fee: currentChannel.crossChainFee,
              slippage,
              pairAddress: '',
              swapSuccAmount: timesDecimals(currentChannel.amountOut, toAsset.decimals || 18)
            };
            const swapRes = await this.$request({
              url: '/swap/cross/tx/save',
              data: naboxParams
            });
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
        } else {
          const { currentDex, currentChannel, toAddress } = this.orderInfo;
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
            transferResult = await iSwap._swapExactTokensForETHSupportingFeeOnTransferTokens(this.fromAddress, currentDex.routerAddress, amountIn, amountOutMin, paths, toAddress, deadline, channelBytes32);
          } else {
            transferResult = await iSwap._swapExactTokensForTokensSupportingFeeOnTransferTokens(this.fromAddress, currentDex.routerAddress, amountIn, amountOutMin, paths, toAddress, deadline, channelBytes32);
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
    // 转账
    async transfer() {
      if (!this.platformAddress) {
        this.$message({
          message: this.$t('tips.tips21'),
          type: 'warning',
          duration: 2000,
          offset: 30
        });
        return;
      }
      try {
        // 获取当前账户
        const currentAccount = getCurrentAccount(this.orderInfo.address);
        const { fromNetwork, fromAsset, amount, address, fromAmount } = this.orderInfo;
        if (fromNetwork === 'NERVE' || fromNetwork === 'NULS') {
          let checkAssetSupport = true;
          const { chainId, assetId } = fromAsset;
          if (fromNetwork === 'NERVE') {
            checkAssetSupport = chainId === MAIN_INFO.chainId && assetId === MAIN_INFO.assetId;
          } else {
            checkAssetSupport = chainId === NULS_INFO.chainId && assetId === NULS_INFO.assetId;
          }
          if (!checkAssetSupport) {
            this.$message({
              message: this.$t('tips.tips26'),
              type: 'warning',
              offset: 30,
              duration: 3000
            });
            return;
          }
          // 普通转账
          const transfer = new NTransfer({
            chain: fromNetwork,
            type: 2
          });
          const transferInfo = {
            from: address,
            to: this.platformAddress,
            assetsChainId: fromAsset.chainId,
            assetsId: fromAsset.assetId,
            amount: timesDecimals(amount, fromAsset.decimals),
            fee: timesDecimals(0.001, 8)
          };
          const inputOutput = await transfer.inputsOrOutputs(transferInfo);
          const data = {
            inputs: inputOutput.inputs,
            outputs: inputOutput.outputs,
            txData: {},
            pub: currentAccount.pub,
            signAddress: currentAccount.address.Ethereum
          };
          const txHex = await transfer.getTxHex(data);
          if (txHex) {
            await this.broadcastHex(txHex, '');
          }
        } else {
          const transfer = new ETransfer();
          const transferInfo = {
            value: fromAmount,
            decimals: fromAsset.decimals,
            contractAddress: fromAsset.contractAddress,
            to: this.platformAddress
          };
          const res = await transfer.commonTransfer(transferInfo);
          if (res && res.hash) {
            await this.broadcastHex('', res.hash);
          }
        }
      } catch (e) {
        this.$message({
          message: this.$t('tips.tips7'),
          type: 'warning',
          offset: 30
        });
      }
    },
    // 稳定币转账
    async stableTransfer(txData, usdtnTransfer = false) {
      try {
        const { contractAddress, fromAmount, address, decimals } = this.orderInfo;
        const transfer = new ETransfer();
        const params = {
          multySignAddress: txData.multySignAddress,
          numbers: fromAmount,
          fromAddress: address,
          decimals,
          nerveAddress: txData.swapNerveAddress,
          contractAddress
        };
        const res = await transfer.crossIn(params);
        if (res && res.hash) {
          if (usdtnTransfer) {
            await this.broadcastUsdtnTransfer(res.hash);
          } else {
            await this.broadcastNaboxTx(res.hash);
          }
        }
      } catch (e) {
        this.$message({
          type: 'warning',
          message: e.message,
          offset: 30
        });
      }
    },
    // 广播swapBox usdt兑换交易
    async broadcastNaboxTx(hash) {
      const { toAsset, fromNetwork, address, contractAddress, fromAmount, pairAddress, decimals } = this.orderInfo;
      const params = {
        fromChain: fromNetwork,
        toChain: toAsset.mainNetwork,
        platform: 'nabox',
        fromAddress: address,
        toAddress: address,
        txHash: hash,
        contractAddress: contractAddress,
        amount: timesDecimals(fromAmount, decimals),
        pairAddress,
        auth: '1561ced6ef90f5d60ce669ba',
        swapAmount: timesDecimals(this.orderInfo.currentPlatform.minReceive, toAsset.decimals) // 最低收到/预计收到
      };
      const res = await this.$request({
        url: '/swap/cross/swapTx',
        data: params
      });
      if (res.code === 1000 && res.data) {
        this.$message({
          type: 'success',
          message: this.$t('tips.tips24'),
          offset: 30,
          duration: 1500
        });
        setTimeout(() => {
          // this.$router.go(-1)
          this.$router.push({ path: '/orderDetail', query: { txHash: res.data.txHash }});
          this.$emit('confirm');
        }, 1500);
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('tips.tips15'),
          offset: 30
        });
      }
      this.confirmLoading = false;
    },
    // 同链usdtn兑换
    async broadcastUsdtnTransfer(txHash) {
      const { fromAsset, toAsset, decimals, fromAmount, address, fromNetwork } = this.orderInfo;
      const fromCoin = {
        chainId: fromAsset.chainId,
        assetId: fromAsset.assetId,
        contractAddress: fromAsset.contractAddress
      };
      const toCoin = {
        chainId: toAsset.chainId,
        assetId: toAsset.assetId,
        contractAddress: toAsset.contractAddress
      };
      const data = {
        platform: 'nabox',
        channel: 'nabox',
        chain: fromNetwork,
        address,
        fromCoin,
        toCoin,
        amount: timesDecimals(fromAmount, decimals),
        txHash
      };
      const res = await this.$request({
        url: '/swap/usdtn/exchange',
        data
      });
      if (res.code === 1000 && res.data) {
        this.$message({
          type: 'success',
          message: this.$t('tips.tips24'),
          offset: 30,
          duration: 1500
        });
        setTimeout(() => {
          this.$router.push({ path: '/orderDetail', query: { txHash: res.data.txHash }});
          this.$emit('confirm');
        }, 1500);
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('tips.tips15'),
          offset: 30
        });
      }
      this.confirmLoading = false;
    },
    // 广播其他跨链兑换转账交易
    async broadcastHex(txHex, txHash) {
      if (txHex) { // nerve
        const url = this.$store.state.network === 'NERVE' ? MAIN_INFO.rpc : NULS_INFO.rpc;
        const chainId = this.$store.state.network === 'NERVE' ? MAIN_INFO.chainId : NULS_INFO.chainId;
        const res = await this.$post(url, 'broadcastTx', [chainId, txHex]);
        if (res.result && res.result.hash) {
          const depositCoin = {
            chain: this.orderInfo && this.orderInfo.fromAsset.chain,
            chainId: this.orderInfo && this.orderInfo.fromAsset.chainId,
            assetId: this.orderInfo && this.orderInfo.fromAsset.assetId,
            contractAddress: this.orderInfo && this.orderInfo.fromAsset.contractAddress,
            symbol: this.orderInfo && this.orderInfo.fromAsset.symbol,
            coinCode: this.orderInfo && this.orderInfo.fromAsset.coinCode,
            amount: this.orderInfo && this.orderInfo.fromAmount
          };
          const receiveCoin = {
            chain: this.orderInfo && this.orderInfo.toAsset.chain,
            chainId: this.orderInfo && this.orderInfo.toAsset.chainId,
            assetId: this.orderInfo && this.orderInfo.toAsset.assetId,
            contractAddress: this.orderInfo && this.orderInfo.toAsset.contractAddress,
            symbol: this.orderInfo && this.orderInfo.toAsset.symbol,
            coinCode: this.orderInfo && this.orderInfo.toAsset.coinCode,
            amount: this.orderInfo && this.orderInfo.toAmount
          };
          const params = {
            address: this.orderInfo && this.orderInfo.address,
            txHash: res.result.hash,
            depositCoin,
            receiveCoin,
            orderId: this.orderId
          };
          const res = this.$request({
            url: '/swap/swft/exchange',
            data: params
          });
          if (res.code === 1000 && res.data) {
            this.$message({
              message: this.$t('tips.tips24'),
              type: 'success',
              offset: 30,
              duration: 1500
            });
            setTimeout(() => {
              this.$router.push({ path: '/orderDetail', query: { txHash: res.data.txHash }});
              this.$emit('confirm');
            }, 1500);
          }
        } else {
          this.$message({
            message: this.$t('tips.tips7'),
            type: 'warning',
            offset: 30
          });
        }
      } else { // 异构链
        const depositCoin = {
          chain: this.orderInfo && this.orderInfo.fromAsset.chain,
          chainId: this.orderInfo && this.orderInfo.fromAsset.chainId,
          assetId: this.orderInfo && this.orderInfo.fromAsset.assetId,
          contractAddress: this.orderInfo && this.orderInfo.fromAsset.contractAddress,
          symbol: this.orderInfo && this.orderInfo.fromAsset.symbol,
          coinCode: this.orderInfo && this.orderInfo.fromAsset.coinCode,
          amount: this.orderInfo && this.orderInfo.fromAmount
        };
        const receiveCoin = {
          chain: this.orderInfo && this.orderInfo.toAsset.chain,
          chainId: this.orderInfo && this.orderInfo.toAsset.chainId,
          assetId: this.orderInfo && this.orderInfo.toAsset.assetId,
          contractAddress: this.orderInfo && this.orderInfo.toAsset.contractAddress,
          symbol: this.orderInfo && this.orderInfo.toAsset.symbol,
          coinCode: this.orderInfo && this.orderInfo.toAsset.coinCode,
          amount: this.orderInfo && this.orderInfo.toAmount
        };
        const params = {
          address: this.orderInfo && this.orderInfo.address,
          txHash: txHash,
          depositCoin,
          receiveCoin,
          orderId: this.orderId,
          fee: this.orderInfo && this.orderInfo.withdrawFee
        };
        const res = await this.$request({
          url: '/swap/swft/exchange',
          data: params
        });
        if (res.code === 1000 && res.data) {
          this.$message({
            message: this.$t('tips.tips24'),
            type: 'success',
            offset: 30,
            duration: 1500
          });
          setTimeout(() => {
            // this.$router.go(-1)
            this.$emit('confirm');
          }, 1500);
        } else {
          this.$message({
            message: this.$t('tips.tips7'),
            type: 'warning',
            offset: 30
          });
        }
      }
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
