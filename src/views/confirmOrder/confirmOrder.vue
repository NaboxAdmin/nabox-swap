<template>
  <div class="main-cont">
    <NavBar :nav-title="$t('navBar.navBar1')"/>
    <div class="position-cont_nav"/>
    <div class="order-cont" v-loading="confirmLoading">
      <div class="d-flex align-items-center justify-content-center">
        <div class="coin-icon" v-if="orderInfo">
          <img :src="getPicture(orderInfo.fromAsset.symbolImg)" @error="pictureError" alt="">
        </div>
        <div class="coin-icon">
          <img :src="getPicture(orderInfo.toAsset.symbolImg)" @error="pictureError" alt="">
        </div>
      </div>
      <div class="order-info" v-if="orderInfo">
        <div class="detail-info mt-4">{{ orderInfo && orderInfo.fromAmount }} {{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.symbol }}</div>
        <div class="down-icon">
          <svg t="1626399197531" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1100" width="20" height="20"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#31B6A9" p-id="1101"></path><path d="M753.408 527.616a36.608 36.608 0 0 0-51.2-3.84l-153.6 132.608V288a36.352 36.352 0 0 0-72.704 0v368.384l-153.6-132.608a36.608 36.608 0 1 0-47.616 55.296l213.76 184.576a41.728 41.728 0 0 0 9.728 5.632h2.048a41.472 41.472 0 0 0 11.264 1.792 41.472 41.472 0 0 0 11.264-1.792h2.048a41.728 41.728 0 0 0 9.728-5.632l213.76-184.576a36.608 36.608 0 0 0 5.12-51.456z" fill="#FFFFFF" p-id="1102"></path></svg>
        </div>
        <div class="detail-info mt-2">{{ orderInfo.toAmount }} {{ orderInfo && orderInfo.toAsset && orderInfo.toAsset.symbol }}</div>
      </div>
      <div class="dash_cont"></div>
      <div class="order-detail_info">
        <div class="d-flex align-items-center space-between">
          <span class="text-aa">From</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ orderInfo &&  orderInfo.fromAsset && orderInfo.fromAsset.mainNetwork }}</span>
            <span  class="ml-4">{{ superLong(orderInfo && orderInfo.address) }}</span>
          </div>
        </div>
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">To</span>
          <div class="d-flex align-items-center justify-content-end">
            <span class="size-20 sign">{{ orderInfo && orderInfo.toAsset && orderInfo.toAsset.mainNetwork }}</span>
            <span  class="ml-4">{{ superLong(orderInfo && orderInfo.address) }}</span>
          </div>
        </div>
        <!--汇率-->
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">{{ $t('swap.swap5') }}</span>
          <div class="d-flex align-items-center justify-content-end" v-if="orderInfo.swapRate">
            <span  class="ml-4">1{{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.symbol }} ≈ {{ orderInfo && orderInfo.swapRate }} {{ orderInfo && orderInfo.fromAsset && orderInfo.toAsset.symbol }}</span>
          </div>
          <div class="d-flex align-items-center justify-content-end" v-else>
            <span  class="ml-4">1{{ orderInfo && orderInfo.fromAsset && orderInfo.fromAsset.symbol }} ≈ 1{{ orderInfo && orderInfo.fromAsset && orderInfo.toAsset.symbol }}</span>
          </div>
        </div>
        <!--手续费-->
        <div class="d-flex align-items-center space-between mt-5">
          <span class="text-aa">{{ $t('swap.swap6') }}</span>
          <div class="d-flex align-items-center justify-content-end" v-if="!orderInfo.stableFee">
            <span  class="ml-4 text-ec"><span class="text-3a" v-if="orderInfo.withdrawFee">
              <span v-if="orderInfo.transferFee">{{ orderInfo.transferFee | numberFormat }}{{ orderInfo.fromAsset && orderInfo.fromAsset.symbol }}</span> {{ orderInfo.withdrawFee }}{{orderInfo.toAsset && orderInfo.toAsset.symbol}}</span></span>
          </div>
          <div class="d-flex align-items-center justify-content-end" v-else>
            <span  class="ml-4 text-ec">
              <span class="text-3a">
                {{ orderInfo.stableFee }}{{orderInfo.fromAsset && orderInfo.fromAsset.symbol}}
              </span>
            </span>
          </div>
        </div>
        <div class="btn cursor-pointer" v-if="crossInAuth" @click="approveERC20">{{ $t('transfer.transfer8') }}</div>
        <div class="btn cursor-pointer" v-else @click="confirmOrder">{{ $t('confirmOrder.confirmOrder1') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/NavBar/NavBar";
import { ETHNET, MAIN_INFO, NULS_INFO } from "@/config";
import { timesDecimals, getCurrentAccount } from '@/api/util';
import {ETransfer, NTransfer} from "../../api/api";

export default {
  name: "confirmOrder",
  components: { NavBar },
  data() {
    return {
      orderInfo: null,
      confirmLoading: false,
      platformAddress: '', // 平台地址
      getAllowanceTimer: null,
      crossInAuth: false
    }
  },
  beforeCreate() {
    // console.log(sessionStorage.getItem('network'), JSON.parse(sessionStorage.getItem('swapInfo')), 123123);
    if (sessionStorage.getItem('network') === JSON.parse(sessionStorage.getItem('swapInfo')).fromNetwork) {
      // document.querySelector('body').setAttribute('style', 'background-color:#6EB6A9;font-size:12px')
    }
  },
  created() {
    const orderInfo = JSON.parse(sessionStorage.getItem('swapInfo'));
    const storageNetwork = sessionStorage.getItem('network');
    if (Object.keys(this.$route.query).length > 0) {
      this.orderInfo = JSON.parse(decodeURIComponent(this.$route.query.orderInfo));
      const assetInfo = {
        chain: this.orderInfo.fromNetwork,
        address: this.orderInfo.address,
        chainId: this.orderInfo.fromAsset.chainId,
        assetId: this.orderInfo.fromAsset.assetId,
        contractAddress: this.orderInfo.fromAsset.contractAddress,
      }
      this.getAssetDetailInfo(assetInfo);
    } else {
      this.orderInfo = JSON.parse(sessionStorage.getItem('swapInfo'));
      const assetInfo = {
        chain: this.orderInfo.fromNetwork,
        address: this.orderInfo.address,
        chainId: this.orderInfo.fromAsset.chainId,
        assetId: this.orderInfo.fromAsset.assetId,
        contractAddress: this.orderInfo.fromAsset.contractAddress,
      }
      this.getAssetDetailInfo(assetInfo);
    }
    if (orderInfo.fromNetwork !== storageNetwork) {
      this.$router.go(-1);
    }
  },
  methods: {
    // 获取资产详情
    async getAssetDetailInfo(assetInfo) {
      const data = {
        chain: assetInfo.chain,
        address: assetInfo.address,
        chainId: assetInfo.chainId,
        assetId: assetInfo.assetId,
        contractAddress: assetInfo.contractAddress,
        refresh: true
      }
      const res = await this.$request({
        url: '/wallet/address/asset',
        data
      });
      if (res.data && res.code === 1000) {
        this.currentAssetInfo = res.data;
        if (res.data.assetId === 0 && this.orderInfo.fromNetwork !== "NULS") {
          await this.checkCrossInAuthStatus();
        } else {
          this.crossInAuth = false;
        }
      }
    },
    // 查询异构链token资产授权情况
    async checkCrossInAuthStatus() {
      const transfer = new ETransfer();
      const heterogeneousInfo = this.currentAssetInfo.heterogeneousList.filter(
          (v) => v.chainName === this.orderInfo.fromNetwork
      )[0];
      const contractAddress = this.currentAssetInfo.contractAddress;
      const needAuth = await transfer.getERC20Allowance(
          contractAddress,
          heterogeneousInfo.heterogeneousChainMultySignAddress,
          this.fromAddress
      );
      this.crossInAuth = needAuth;
      if (!needAuth && this.getAllowanceTimer) {
        this.clearGetAllowanceTimer();
      }
    },

    // 异构链token资产转入nerve授权
    async approveERC20() {
      this.confirmLoading = true;
      try {
        const transfer = new ETransfer();
        const heterogeneousInfo = this.currentAssetInfo.heterogeneousList.filter(
            (v) => v.chainName === this.orderInfo.fromNetwork
        )[0];
        const contractAddress = this.currentAssetInfo.contractAddress;
        const res = await transfer.approveERC20(
            contractAddress,
            heterogeneousInfo.heterogeneousChainMultySignAddress,
            this.fromAddress
        );
        if (res.hash) {
          this.$message({
            message: this.$t("tips.tips14"),
            type: "success",
            duration: 2000,
            offset: 30
          });
          this.setGetAllowanceTimer();
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: "warning",
            duration: 2000,
            offset: 30
          });
        }
        this.confirmLoading = false;
      } catch (e) {
        console.log(e);
        this.$message.warning({ message: e.message, offset: 30 });
        this.confirmLoading = false;
      }
    },

    clearGetAllowanceTimer() {
      if (!this.getAllowanceTimer) return;
      clearInterval(this.getAllowanceTimer);
      this.getAllowanceTimer = null;
    },

    setGetAllowanceTimer() {
      this.getAllowanceTimer = setInterval(() => {
        this.checkCrossInAuthStatus();
      }, 3000)
    },

    // 确认订单
    async confirmOrder() {
      this.confirmLoading = true;
      console.log(this.orderInfo.currentPlatform.platform);
      if (this.orderInfo.currentPlatform.platform === 'NaboxPool') { // 稳定币确认订单
        console.log('NaboxPool')
        // const params = {
        //   fromChain: this.orderInfo && this.orderInfo.fromNetwork,
        //   contractAddress: this.orderInfo && this.orderInfo.fromAsset.contractAddress,
        //   pairAddress: this.orderInfo && this.orderInfo.pairAddress,
        //   fromAddress: this.orderInfo && this.orderInfo.address,
        //   amount: this.orderInfo && this.orderInfo.fromAmount,
        //   auth: '1561ced6ef90f5d60ce669ba'
        // }
        const params = {
          fromChain: this.orderInfo.fromNetwork
        }
        const res = await this.$request({
          url: '/swap/conf',
          data: params
        });
        if (res.code === 1000 && res.data) {
          const tempData = res.data;
          await this.stableTransfer(tempData);
        }
        this.confirmLoading = false;
      } else {
        const depositCoin = {
          chain: this.orderInfo && this.orderInfo.fromAsset.chain,
          chainId: this.orderInfo && this.orderInfo.fromAsset.chainId,
          assetId: this.orderInfo && this.orderInfo.fromAsset.assetId,
          contractAddress: this.orderInfo && this.orderInfo.fromAsset.contractAddress,
          symbol: this.orderInfo && this.orderInfo.fromAsset.symbol,
          coinCode: this.orderInfo && this.orderInfo.fromAsset.coinCode,
          amount: this.orderInfo && this.orderInfo.fromAmount,
        };
        const receiveCoin = {
          chain: this.orderInfo && this.orderInfo.toAsset.chain,
          chainId: this.orderInfo && this.orderInfo.toAsset.chainId,
          assetId: this.orderInfo && this.orderInfo.toAsset.assetId,
          contractAddress: this.orderInfo && this.orderInfo.toAsset.contractAddress,
          symbol: this.orderInfo && this.orderInfo.toAsset.symbol,
          coinCode: this.orderInfo && this.orderInfo.toAsset.coinCode,
          amount: this.orderInfo && this.orderInfo.toAmount,
        }
        const params = {
          address: this.orderInfo && this.orderInfo.address,
          depositCoin,
          receiveCoin
        }
        const res = await this.$request({
          url: '/swap/swft/order',
          data: params
        });
        if (res.code===1000 && res.data) {
          this.platformAddress = res.data.platformAddr;
          this.orderId = res.data.orderId;
          await this.transfer();
        } else {
          this.$message({
            type: 'warning',
            message: res.msg,
            offset: 30,
          })
        }
        this.confirmLoading = false;
      }
    },
    // 转账
    async transfer() {
      if (!this.platformAddress) {
        this.$message({
          message: this.$t("tips.tips21"),
          type: "warning",
          duration: 2000,
          offset: 30,
        });
        return;
      }
      try {
        // 获取当前账户
        const currentAccount = getCurrentAccount(this.orderInfo.address);
        const { fromNetwork, fromAsset, amount, address, fromAmount } = this.orderInfo;
        if (fromNetwork === "NERVE" || fromNetwork === "NULS") {
          let checkAssetSupport = true;
          const { chainId, assetId } = fromAsset
          if (fromNetwork === "NERVE") {
            checkAssetSupport = chainId === MAIN_INFO.chainId && assetId === MAIN_INFO.assetId
          } else {
            checkAssetSupport = chainId === NULS_INFO.chainId && assetId === NULS_INFO.assetId
          }
          if (!checkAssetSupport) {
            this.$message({
              message: "暂未支持非主资产转账",
              type: "warning",
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
          }
          const inputOutput = await transfer.inputsOrOutputs(transferInfo);
          const data = {
            inputs: inputOutput.inputs,
            outputs: inputOutput.outputs,
            txData: {},
            pub: currentAccount.pub,
            signAddress: currentAccount.address.Ethereum,
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
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500);
          }
        }
      } catch (e) {
        this.$message({
          message: this.$t("tips.tips7"),
          type: "warning",
          offset: 30,
        })
      }
    },
    // 稳定币转账
    async stableTransfer(txData) {
      try {
        const { contractAddress, fromAmount, address, decimals } = this.orderInfo;
        const transfer = new ETransfer();
        const params = {
          multySignAddress: txData.multySignAddress,
          numbers: fromAmount,
          fromAddress: address,
          decimals,
          nerveAddress: txData.nerveAddress,
          contractAddress,
        }
        const res = await transfer.crossIn(params);
        if (res && res.hash) {
          await this.broadcastNaboxTx(res.hash)
        }
      } catch (e) {
        this.$message({
          type: 'warning',
          message: e.message,
          offset: 30,
        })
      }
    },
    // 广播naboxswap交易
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
        swapAmount: this.orderInfo.currentPlatform.minReceive // 最低收到/预计收到
      }
      const res = await this.$request({
        url: '/swap/cross/swapTx',
        data: params
      });
      if (res.code === 1000) {
        this.$message({
          type: 'success',
          message: this.$t('tips.tips10'),
          offset: 30
        });
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('tips.tips15'),
          offset: 30
        })
      }
      this.confirmLoading = false
    },
    //广播其他跨链兑换转账交易
    async broadcastHex(txHex, txHash) {
      if (txHex) { // nerve
        const url = this.$store.state.network === "NERVE" ? MAIN_INFO.rpc : NULS_INFO.rpc;
        const chainId = this.$store.state.network === "NERVE" ? MAIN_INFO.chainId : NULS_INFO.chainId;
        const res = await this.$post(url, 'broadcastTx', [chainId, txHex]);
        if (res.result && res.result.hash) {
          const depositCoin = {
            chain: this.orderInfo && this.orderInfo.fromAsset.chain,
            chainId: this.orderInfo && this.orderInfo.fromAsset.chainId,
            assetId: this.orderInfo && this.orderInfo.fromAsset.assetId,
            contractAddress: this.orderInfo && this.orderInfo.fromAsset.contractAddress,
            symbol: this.orderInfo && this.orderInfo.fromAsset.symbol,
            coinCode: this.orderInfo && this.orderInfo.fromAsset.coinCode,
            amount: this.orderInfo && this.orderInfo.fromAmount,
          };
          const receiveCoin = {
            chain: this.orderInfo && this.orderInfo.toAsset.chain,
            chainId: this.orderInfo && this.orderInfo.toAsset.chainId,
            assetId: this.orderInfo && this.orderInfo.toAsset.assetId,
            contractAddress: this.orderInfo && this.orderInfo.toAsset.contractAddress,
            symbol: this.orderInfo && this.orderInfo.toAsset.symbol,
            coinCode: this.orderInfo && this.orderInfo.toAsset.coinCode,
            amount: this.orderInfo && this.orderInfo.toAmount,
          }
          const params = {
            // address: this.orderInfo && this.orderInfo.address,
            txHash: res.result.hash,
            depositCoin,
            receiveCoin,
            orderId: this.orderId
          }
          const res = this.$request({
            url: '/swap/swft/exchange',
            data: params
          });
          if (res.code === 1000 && res.data) {
            this.$message({
              message: this.$t("tips.tips10"),
              type: "success",
              offset: 30
            })
          }
        } else {
          this.$message({
            message: this.$t("tips.tips7"),
            type: "warning",
            offset: 30,
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
          amount: this.orderInfo && this.orderInfo.fromAmount,
        };
        const receiveCoin = {
          chain: this.orderInfo && this.orderInfo.toAsset.chain,
          chainId: this.orderInfo && this.orderInfo.toAsset.chainId,
          assetId: this.orderInfo && this.orderInfo.toAsset.assetId,
          contractAddress: this.orderInfo && this.orderInfo.toAsset.contractAddress,
          symbol: this.orderInfo && this.orderInfo.toAsset.symbol,
          coinCode: this.orderInfo && this.orderInfo.toAsset.coinCode,
          amount: this.orderInfo && this.orderInfo.toAmount,
        }
        const params = {
          // address: this.orderInfo && this.orderInfo.address,
          txHash: txHash,
          depositCoin,
          receiveCoin,
          orderId: this.orderId
        }
        const res = await this.$request({
          url: '/swap/swft/exchange',
          data: params
        });
        if (res.code === 1000 && res.data) {
          this.$message({
            message: this.$t("tips.tips10"),
            type: "success",
            offset: 30
          })
        } else {
          this.$message({
            message: this.$t("tips.tips7"),
            type: "warning",
            offset: 30,
          })
        }
      }
    },
  },
  beforeDestroy() {
    // document.querySelector('body').removeAttribute('style');
    // document.querySelector('body').setAttribute('style', 'font-size:12px');
    if (this.getAllowanceTimer) {
      clearTimeout(this.getAllowanceTimer);
      this.getAllowanceTimer = null;
    }
  }
}
</script>

<style scoped lang="scss">
@import "confirmOrder.scss";
</style>