<template>
  <div class="p-3 bg-white">
    <div class="position-fixed_loading" v-if="showLoading" v-loading="showLoading"/>
    <div class="banner-cont">

    </div>
    <div class="farm-total p-2 mt-2">
      <div class="text-left size-22 text-d5">{{ $t("airdrop.airdrop1") }}</div>
      <div class="d-flex direction-column align-items-center mt-12">
        <span class="size-34 font-500 text-white">{{ LpFarmInfo && LpFarmInfo.poolModelInfo.candyBalance || 0 }}</span>
        <span class="font-500 text-d5 size-26">≈${{ formatPrice(LpFarmInfo && LpFarmInfo.poolModelInfo.candyBalance || 0, LpFarmInfo && LpFarmInfo.candyPrice || 0) }}</span>
      </div>
    </div>
    <div class="stake-cont mt-2">
      <div class="d-flex align-items-center space-between">
        <span class="size-28 text-90">{{ $t("airdrop.airdrop2") }} {{ LpFarmInfo && LpFarmInfo.candySymbol || 'NABOX' }}</span>
        <p class="d-flex align-items-center" @click="toUrl">
          <span class="text-primary size-28 cursor-pointer">{{ $t("airdrop.airdrop10") }}</span>
          <span class="icon-cont">
            <img src="@/assets/image/link_to.png" alt="">
          </span>
        </p>
      </div>
      <div class="size-34 text-3a font-500 mt-3">{{ lockedToken && lockedToken.lockedToken | numFormat }}</div>
      <div class="mt-12 text-90 size-26">≈{{ formatPrice(lockedToken && lockedToken.lockedToken, LpFarmInfo && LpFarmInfo.candyPrice || 0, 3) }}</div>
      <div class="mt-3 d-flex align-items-center">
        <span>{{ LpFarmInfo && LpFarmInfo.lpSymbol }} {{ $t("airdrop.airdrop3") }}</span>
        <span class="calculate-icon cursor-pointer" @click="showCalculate=true">
          <img src="@/assets/image/calculator.png" alt="">
        </span>
      </div>
      <div class="size-34 mt-23 text-3a">{{ formatDecimals(userFarmInfo && userFarmInfo.userFarmInfo['1'] || 0, LpFarmInfo && LpFarmInfo.lpDecimals) || 0 }}</div>
      <div class="btn-cont d-flex align-items-center space-between">
        <template>
          <div v-if="!needAuth"
               class="btn-item cursor-pointer"
               :class="{ active_btn: !LpFarmInfo || LpFarmInfo && LpFarmInfo.poolModelInfo.candyBalance == 0 }"
               @click="stakeClick('stake')">{{ $t("airdrop.airdrop4") }}</div>
          <div
              class="btn-item cursor-pointer"
              v-else
              @click="assetApprove()">{{ $t("vaults.over6") }}</div>
        </template>
        <!-- :class="{ active_btn: !userFarmInfo || userFarmInfo && Number(userFarmInfo.userFarmInfo['1']) <= 0 }"-->
        <div class="btn-item cursor-pointer"
             @click="stakeClick('withdraw')">{{ $t("airdrop.airdrop8") }}</div>
      </div>
    </div>
    <div class="claim-cont mt-2">
      <div class="size-28 text-90">{{ $t("airdrop.airdrop5") }} {{ LpFarmInfo && LpFarmInfo.candySymbol }}</div>
      <div class="mt-3 text-3a size-34 font-500">{{ pendingToken && pendingToken.pendingToken | numFormat }}</div>
      <div class="size-26 text-90 mt-12">≈{{ formatPrice(pendingToken && pendingToken.pendingToken, LpFarmInfo && LpFarmInfo.candyPrice || 0) }}</div>
      <div class="btn cursor-pointer" :class="{ active_btn: !pendingToken || pendingToken && Number(pendingToken.pendingToken) <= 0 }" @click="claimClick">{{ $t("airdrop.airdrop6") }}</div>
    </div>
    <pop-up :show.sync="showCalculate">
      <div class="calculate-cont">
        <div class="d-flex justify-content-end">
          <span class="exit-icon" @click.stop="showCalculate = false; resetInput()">
            <svg t="1626838971768" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1604" width="14" height="14"><path d="M602.476163 514.068707l403.54275-403.54275A64.199983 64.199983 0 0 0 913.937795 19.178553l-403.54275 403.54275L110.154008 19.178553A64.199983 64.199983 0 0 0 18.806604 110.525957l403.54275 403.54275-403.54275 403.54275A64.199983 64.199983 0 0 0 110.154008 1004.923434l403.54275-403.54275 403.54275 403.54275a64.199983 64.199983 0 0 0 90.61369-90.613691z" fill="#333333" p-id="1605"></path></svg>
          </span>
        </div>
        <div class="text-left font-500 text-3a size-36">{{ $t("airdrop.airdrop14") }}</div>
        <div class="text-90 size-28 mt-6">{{ $t("airdrop.airdrop9") }} Nabox</div>
        <div class="mt-23 size-34 font-500 text-3a">{{ lockedToken && lockedToken.lockedToken | numFormat }}</div>
        <div class="mt-6 d-flex space-between">
          <span class="size-26 text-90">{{ LpFarmInfo && LpFarmInfo.lpSymbol }} LP</span>
          <p class="d-flex align-items-center" @click="toUrl">
            <span class="text-primary size-28 cursor-pointer">{{ $t("airdrop.airdrop10") }}</span>
            <span class="icon-cont">
              <img src="@/assets/image/link_to.png" alt="">
            </span>
          </p>
        </div>
        <div class="input-cont mt-2">
          <input type="number" pattern="^[0-9]*[.,]?[0-9]*$" v-model="liquidityCount" @input="liquidityInput" :placeholder="$t('vaults.vaults9')"/>
        </div>
        <div class="down-icon m-3_auto">
          <img src="@/assets/image/swap.png" alt="">
        </div>
        <div class="input-cont">
          <input type="number" v-model="reverse0Count" @input="reverse0Input" :placeholder="$t('vaults.vaults9')"/>
          <span class="text-90">{{ reverse0Asset && reverse0Asset.symbol || 'NABOX' }}</span>
        </div>
        <div class="down-icon m-2_auto">
          <img src="@/assets/image/plus.png" alt="">
        </div>
        <div class="input-cont">
          <input type="number" v-model="reverse1Count" @input="reverse1Input" :placeholder="$t('vaults.vaults9')"/>
          <span class="text-90">{{ reverse1Asset && reverse1Asset.symbol || 'BUSD' }}</span>
        </div>
        <div class="d-flex mt-4 space-between">
          <span class="text-90 size-28">{{ $t("airdrop.airdrop11") }}</span>
          <span class="text-3a">{{ unlockedSpeed }} {{ reverse0Asset && reverse0Asset.symbol || 'NABOX' }}/{{ $t("airdrop.airdrop15") }}</span>
        </div>
        <div class="d-flex mt-3 space-between">
          <span class="text-90 size-28">{{ $t("airdrop.airdrop12") }}</span>
          <span class="text-3a">{{ unlockedTime }} {{ $t("airdrop.airdrop13") }}</span>
        </div>
      </div>
    </pop-up>
    <pop-up :show.sync="showStake">
      <div class="pop-cont">
        <div class="size-36 font-500">{{ stakeType === 'stake' && $t("vaults.vaults4") || $t("vaults.vaults4") }}</div>
        <div class="text-right mt-2 text-90 size-26" v-if="stakeType==='stake'">{{ $t("vaults.vaults5") }}：{{ stakedAsset && stakedAsset.balance || 0 }} {{ stakedAsset && stakedAsset.symbol }}</div>
        <div class="text-right mt-2 text-90 size-26" v-else>{{ $t("vaults.vaults5") }}：{{ formatDecimals(userFarmInfo && userFarmInfo.userFarmInfo['1'] || 0, LpFarmInfo && LpFarmInfo.lpDecimals, 3) || 0 }}  {{ stakedAsset && stakedAsset.symbol }}</div>
        <div class="input-cont">
          <input :placeholder="$t('vaults.vaults9')"
                 pattern="^[0-9]*[.,]?[0-9]*$"
                 type="text"
                 @input="lpInput"
                 v-model="lpCount">
          <span @click="maxCount">{{ $t("vaults.vaults6") }}</span>
        </div>
        <div class="text-red mt-2" v-if="amountMsg">{{ amountMsg }}</div>
        <div class="pop-btn d-flex align-items-center space-between mt-4">
          <div class="btn" @click="showStake = false; lpCount=''; amountMsg=''">{{ $t("vaults.vaults7") }}</div>
          <div class="btn btn_active" @click="confirm">{{ $t("vaults.vaults8") }}</div>
        </div>
      </div>
    </pop-up>
  </div>
</template>

<script>
import PopUp from "../../components/PopUp/PopUp";
import { divisionDecimals, Minus, timesDecimals, Times, Division, formatFloatNumber, tofix } from "../../api/util";
import { ETransfer } from "@/api/api";
import { ethers } from "ethers";
import { getBatchUserFarmInfo, getBatchERC20Balance } from "../../api/api";
import { ABIConfig, pancakeABI } from "./ABIConfig";

export default {
  name: "airdrop",
  components: { PopUp },
  data() {
    return {
      showCalculate: false,
      showStake: false,
      amountMsg: "",
      lpCount: "",
      stakeType: "",
      LpFarmInfo: null, // 当前的矿池信息
      userFarmInfo: null, // 当前用户的farm信息
      pendingToken: null, // 已解锁未领取Token
      lockedToken: null, // 锁定的Token
      stakedAsset: null, // 当前质押资产的余额
      candyAsset: null, // 当前奖励资产的余额
      needAuth: false,
      showLoading: false,
      reverse0Count: "",
      reverse1Count: "",
      liquidityCount: "",
      rate: 5,
      reverse0: "1153770723954217592642132814",
      reverse1: "392948295898899396956072",
      totalSupply: "17944746760119496596621555",
      // reverse0: 0,
      // reverse1: 0,
      // totalSupply: 0,
      reverse0Flag: false,
      reverse1Flag: false,
      liquidityFlag: false,
      unlockedSpeed: 0,
      unlockedTime: 0, // hours
      reverse0Asset: null, // token0资产
      reverse1Asset: null, // token1资产
      liquidityAsset: null, // lp资产
      farmTimer: null,
      maxUnlockedSpeed: 0 // 最大解锁速度
    }
  },
  created() {
    this.getLpFarmInfo();
    // this.getPancakeFarmInfo();
    this.farmTimer = setInterval(() => {
      this.getLpFarmInfo();
    }, 10000);
    // 主网上面调用
    this.rate = Division(this.reverse0, this.reverse1);
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
    },
  },
  watch: {
    lpCount: {
      handler(newVal, oldVal) {
        if (newVal) {
          const decimals = (this.stakeType === 'stake' && this.stakedAsset && this.stakedAsset.decimals) || (this.candyAsset && this.candyAsset.decimals) || 8;
          const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
          if (patrn.exec(newVal) || newVal === "") {
            this.lpCount = newVal;
          } else {
            this.lpCount = oldVal;
          }
        } else {
          this.lpCount = "";
        }
      },
      deep: true
    },
    // liquidity = Math.min(amount0.mul(totalSupply) / reserve0, amount1.mul(totalSupply) / reserve1)
    reverse0Count: {
      handler(newVal, oldVal) {
        const decimals = this.reverse0Asset && this.reverse0Asset.decimals || 18;
        const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
        if (patrn.exec(newVal) || newVal === "") {
          this.reverse0Count = newVal;
        } else {
          this.reverse0Count = oldVal;
        }
        if (newVal && !this.liquidityFlag && !this.reverse1Flag) {
          const tempNewval = timesDecimals(newVal, 18);
          const tempAmount1 = Division(tempNewval, this.rate);
          this.reverse1Count = formatFloatNumber(6, divisionDecimals(tempAmount1, 18));
          this.liquidityCount = formatFloatNumber(6, divisionDecimals(Math.min(Division(Times(tempNewval, this.totalSupply), this.reverse0), Division(Times(tempAmount1, this.totalSupply), this.reverse1)), 18));
          console.log(this.liquidityCount, "liquidityCount");
        } else if (!newVal) {
          this.resetInput();
          console.log(1)
        }
      }
    },
    reverse1Count: {
      handler(newVal, oldVal) {
        console.log(newVal, "reverse1Count newVal");
        const decimals = this.reverse1Asset && this.reverse1Asset.decimals || 18;
        const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
        if (patrn.exec(newVal) || newVal === "") {
          this.reverse1Count = newVal;
        } else {
          this.reverse1Count = oldVal;
        }
        if (newVal && !this.liquidityFlag && !this.reverse0Flag) {
          const tempNewval = timesDecimals(newVal, 18);
          const tempAmount0 = Times(tempNewval, this.rate);
          this.reverse0Count = formatFloatNumber(6, divisionDecimals(tempAmount0, 18));
          this.liquidityCount = formatFloatNumber(6, divisionDecimals(Math.min(Division(Times(tempAmount0, this.totalSupply), this.reverse0), Division(Times(tempNewval, this.totalSupply), this.reverse1)), 18));
          console.log(this.reverse0Count, "reverse1Count")
          // this.liquidityCount = Math.min(Division(Times(this.reverse0Count, this.totalSupply), this.reverse0), Division(Times(tempNewval, this.totalSupply), this.reverse1));
          // console.log(Division(Times(this.reverse0Count, this.totalSupply), this.reverse0).toString(), Division(Times(tempNewval, this.totalSupply), this.reverse1).toString(), "liquidityCount");
        } else if (!newVal) {
          this.resetInput();
        }
      }
    },
    liquidityCount: {
      handler(newVal, oldVal) {
        console.log(newVal, "liquidityCount newVal");
        const decimals = this.LpFarmInfo && this.LpFarmInfo.lpDecimals || 18;
        const patrn = new RegExp("^([1-9][\\d]{0,20}|0)(\\.[\\d]{0," + decimals + "})?$");
        if (newVal) { // 根据LP计算解锁速度
          this.maxUnlockedSpeed = Times(1, this.LpFarmInfo && this.LpFarmInfo.poolModelInfo.candyPerBlockPerLp || 0);
          this.unlockedSpeed = Times(newVal, this.LpFarmInfo && this.LpFarmInfo.poolModelInfo.candyUserBlockMaxLp || 0);
          this.unlockedTime = this.numberFormat(tofix(Division(Times(Times((this.lockedToken && this.lockedToken.lockedToken || 0), this.unlockedSpeed), 3), 3600), 2, -1), 2);
        }
        if (patrn.exec(newVal) || newVal === "") {
          this.liquidityCount = newVal;
        } else {
          this.liquidityCount = oldVal;
        }
        if (newVal && !this.reverse0Flag && !this.reverse1Flag) {
          const tempNewval = timesDecimals(newVal, 18);
          const tempAmount0 = divisionDecimals(Division(Times(this.reverse0, tempNewval), this.totalSupply), 18);
          const tempAmount1 = divisionDecimals(Division(Times(this.reverse1, tempNewval), this.totalSupply), 18);
          const tempAmount1ToAmount0 = Times(tempAmount1, this.rate);
          if (Minus(tempAmount0, tempAmount1ToAmount0) < 0) {
            this.reverse0Count = formatFloatNumber(6, tempAmount0);
            this.reverse1Count = formatFloatNumber(6, Division(tempAmount0, this.rate));
          } else {
            this.reverse0Count = formatFloatNumber(6, tempAmount1ToAmount0);
            this.reverse1Count = formatFloatNumber(6, Division(tempAmount1ToAmount0, this.rate));
          }
        } else if (!newVal) {
          this.resetInput();
        }
      }
    },
    unlockedSpeed: {
      handler(newVal) {
        if (newVal) {
          console.log(newVal.toString(), 'test newVal', this.maxUnlockedSpeed.toString(), "maxUnlockedSpeed");
          this.unlockedTime = this.numberFormat(tofix(Division(Times(Division((this.lockedToken && this.lockedToken.lockedToken || 0), this.unlockedSpeed), 3), 3600), 2, -1), 2);
          if (Minus(newVal, this.maxUnlockedSpeed) > 0) {
            this.unlockedSpeed = this.maxUnlockedSpeed;
            // TODO: 上线时解锁速度保留两位小数
            this.unlockedTime = this.numberFormat(tofix(Division(Times(Division((this.lockedToken && this.lockedToken.lockedToken || 0), this.maxUnlockedSpeed), 3), 3600), 2, -1), 2);
          }
        }
      }
    }
  },
  methods: {
    toUrl() {
      this.isMobile ? window.location.href = 'https://pancakeswap.finance/add/0x755f34709E369D37C6Fa52808aE84A32007d1155/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' : window.open('https://pancakeswap.finance/add/0x755f34709E369D37C6Fa52808aE84A32007d1155/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56');
    },
    reverse0Input() {
      this.reverse0Flag = true;
      this.liquidityFlag = false;
      this.reverse1Flag = false;
    },
    reverse1Input() {
      this.reverse1Flag = true;
      this.liquidityFlag = false;
      this.reverse0Flag = false;
    },
    liquidityInput() {
      this.liquidityFlag = true;
      this.reverse0Flag = false;
      this.reverse1Flag = false;
    },
    resetInput() {
      this.reverse0Count = "";
      this.reverse1Count = "";
      this.liquidityCount = "";
      this.unlockedSpeed = 0;
      this.unlockedTime = 0;
    },
    // 获取当前矿池信息
    async getLpFarmInfo() {
      try {
        const res = await this.$request({
          method: 'get',
          url: "/farm/air/act/info"
        });
        if (res.code === 1000 && res.data) {
          this.LpFarmInfo = {
            ...res.data,
            poolModelInfo: {
              ...res.data.poolModelInfo,
              candyBalance: this.numberFormat(tofix(divisionDecimals(res.data.poolModelInfo.candyBalance, res.data.lpDecimals), 1, -1), 1),
              candyPerBlockPerLp: divisionDecimals(res.data.poolModelInfo.candyPerBlockPerLp, res.data.lpDecimals),
              maxCandyPerUser: divisionDecimals(res.data.poolModelInfo.maxCandyPerUser, res.data.lpDecimals),
              candyUserBlockMaxLp: divisionDecimals(res.data.poolModelInfo.candyUserBlockMaxLp, res.data.lpDecimals)
            }
          };
          this.reverse0Asset = res.data.poolAsset0;
          this.reverse1Asset = res.data.poolAsset1;
          const config = JSON.parse(sessionStorage.getItem("config"));
          const multicallAddress = config[this.fromNetwork].config.multiCallAddress;
          const fromAddress = this.currentAccount['address']['BSC'];
          await this.getUserFarmDetailInfo(res.data.pairAddress, fromAddress, multicallAddress);
          this.needAuth = await this.getSatkeAssetAuth(res.data.lpContractAddress, res.data.pairAddress);
          // console.log(this.needAuth, "need")
          // console.log(this.LpFarmInfo);
          // console.log(res.data, "res.data");
        } else {
          throw res.msg
        }
      } catch (e) {
        this.$message.warning(e)
      }
    },
    // 根据合约查询用户当前的farm的详细信息
    async getUserFarmDetailInfo(pairAddress, userAddress, multicallAddress) {
      const config = JSON.parse(sessionStorage.getItem('config'));
      const RPCUrl = config['BSC']['apiUrl'];
      const balanceTokenRes = await getBatchERC20Balance([ this.LpFarmInfo.lpContractAddress, this.LpFarmInfo.candyContractAddress ], userAddress, multicallAddress, RPCUrl);
      this.stakedAsset = {
        ...balanceTokenRes[0],
        balance: divisionDecimals(balanceTokenRes[0].balance, balanceTokenRes[0].decimals)
      }
      this.candyAsset = {
        ...balanceTokenRes[1],
        balance: divisionDecimals(balanceTokenRes[1].balance, balanceTokenRes[1].decimals)
      }
      // console.log(this.stakeBalance, this.candyBalance, "candyBalance")
      const tokenRes = await getBatchUserFarmInfo(pairAddress, userAddress, multicallAddress, RPCUrl);
      this.userFarmInfo = {
        ...tokenRes[0],
      };
      this.pendingToken = {
        ...tokenRes[1],
        pendingToken: this.numberFormat(tofix(divisionDecimals(tokenRes[1].pendingToken, this.LpFarmInfo.lpDecimals), 2, -1), 2)
      };
      this.lockedToken = {
        ...tokenRes[2],
        lockedToken: this.numberFormat(tofix(divisionDecimals(tokenRes[2].lockedToken, this.LpFarmInfo.lpDecimals), 2, -1), 2)
      };
      // console.log(this.userFarmInfo, this.pendingToken, this.lockedToken, "12312312");
    },
    // 获取pancake上面的farmInfo
    async getPancakeFarmInfo() {
      const pancakeFarm = '0x29b4abb0f8734EA672a0e82FA47998F710B6A07a';
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(pancakeFarm, pancakeABI, provider);
      const token0 = await contract.token0();
      const token1 = await contract.token1();
      const reverse = await contract.getReserves();
      const totalSupply = await contract.totalSupply();
      this.reverse0 = reverse[0].toString();
      this.reverse1 = reverse[1].toString();
      this.totalSupply = totalSupply.toString();
      this.rate = this.reverse0 && this.reverse1 && Division(this.reverse0, this.reverse1);
      console.log(token0, token1, this.reverse0.toString(), this.reverse1.toString(), this.totalSupply.toString());
    },
    lpInput() {
      if (this.stakeType==="stake") {
        if (Minus(this.stakedAsset && this.stakedAsset.balance || 0, this.lpCount) < 0) {
          this.amountMsg = this.$t("tips.tips16");
        } else if (Minus(this.lpCount, 0) == "0") {
          this.amountMsg = this.$t("tips.tips18");
        } else {
          this.amountMsg = '';
        }
      } else {
        console.log(this.userFarmInfo && this.userFarmInfo.userFarmInfo['1'], "123123123");
        const tempInfo = this.formatDecimals(this.userFarmInfo && this.userFarmInfo.userFarmInfo['1'], this.LpFarmInfo && this.LpFarmInfo.lpDecimals);
        if (Minus(tempInfo || 0, this.lpCount) < 0) {
          this.amountMsg = this.$t("tips.tips16");
        } else {
          this.amountMsg = '';
        }
      }
    },
    maxCount() {
      if (this.stakeType === "stake") {
        console.log(this.stakedAsset, "stakeAsset")
        this.lpCount = this.stakedAsset && this.stakedAsset.balance || 0;
        if (Minus(this.lpCount, 0) == "0") {
          this.amountMsg = this.$t("tips.tips18");
        }
      } else {
        this.lpCount = this.formatDecimals(this.userFarmInfo && this.userFarmInfo.userFarmInfo['1'], this.LpFarmInfo && this.LpFarmInfo.lpDecimals) || 0;
        if (Minus(this.lpCount, 0) == "0") {
          this.amountMsg = this.$t("tips.tips18");
        }
      }
    },
    confirm() {
      if (!this.lpCount || this.lpCount === "0" || this.amountMsg) return false;
      this.showLoading = true;
      let amount;
      switch (this.stakeType) {
        case "stake":
          amount = timesDecimals(this.lpCount, this.stakedAsset.decimals || 8);
          this.LpOperation("stake", amount);
          break;
        case "withdraw":
          amount = timesDecimals(this.lpCount, this.stakedAsset.decimals || 8);
          this.LpOperation("withdraw", amount);
          break;
        default:
          return false;
      }
    },
    async LpOperation(type, amount) {
      try {
        const transfer = new ETransfer();
        const wallet = transfer.provider.getSigner();
        const contract = new ethers.Contract(this.LpFarmInfo.pairAddress, ABIConfig, wallet);
        let res;
        switch (type) {
          case 'stake':
            res = await contract.deposit(amount);
            break;
          case 'withdraw':
            res = await contract.withdraw(amount);
            break;
          default:
            return false;
        }
        if (res.hash) {
          await this.broadcastHex({ txHash: res.hash,  amount});
        }
      } catch (e) {
        console.log(e, "e")
        this.showLoading = false;
      }
    },
    // 广播nerve nuls跨链转账交易
    async broadcastHex({ txHash, amount }) {
      const isPledge = this.stakeType === "stake"; // 是否为质押
      let params = {
        chain: this.LpFarmInfo.chain,
        address: this.currentAccount.address[this.LpFarmInfo.chain],
        type: isPledge ? 3 : 4, // 3质押 4撤出质押
        chainId: isPledge ? this.LpFarmInfo.lpChainId : this.LpFarmInfo.candyChainId,
        assetId: isPledge ? this.LpFarmInfo.lpAssetId : this.LpFarmInfo.candyAssetId,
        contractAddress: isPledge ? this.LpFarmInfo.lpContractAddress : this.LpFarmInfo.candyContractAddress,
        amount,
        txHash
      };
      console.log(params, "params")
      const result = await this.$request({
        url: "/swap/vaults/add",
        data: params
      });
      if (result.code === 1000) {
        this.$message({
          message: this.$t("tips.tips10"),
          type: "success",
          offset: 30,
          duration: 2000
        })
      } else {
        this.$message({
          message: this.$t("tips.tips15"),
          type: "warning",
          offset: 30,
          duration: 2000
        })
      }
      this.showLoading = false;
      this.showStake = false;
      this.lpCount='';
      this.amountMsg='';
    },
    claimClick() {
      if (this.pendingToken && Number(this.pendingToken.pendingToken) <= 0) return false;
      this.showLoading = true;
      this.LpOperation('stake', 0);
    },
    // 格式化decimals
    formatDecimals(number, decimals = 8, digits = 2) {
      return isNaN(divisionDecimals(number, decimals)) && '0' || this.numberFormat(tofix(divisionDecimals(number, decimals) || 0, digits, -1), digits);
    },
    formatPrice(amount, usdtPrice, digits = 2) {
      return isNaN(this.numberFormat(tofix(Times(amount, usdtPrice), digits, -1), digits)) && '0' || this.numberFormat(tofix(Times(amount, usdtPrice), digits, -1), digits);
    },
    // 获取领取的资产是否需要授权
    async getSatkeAssetAuth(stakedAssetContractAddress, farmHash) {
      const transfer = new ETransfer();
      return await transfer.getERC20Allowance(
          stakedAssetContractAddress,
          farmHash,
          this.currentAccount.address.Ethereum
      )
    },
    // 资产授权
    async assetApprove() {
      console.log(this.LpFarmInfo, "lpContractAddress")
      this.showLoading = true;
      try {
        const transfer = new ETransfer();
        const contractAddress = this.LpFarmInfo.lpContractAddress;
        const res = await transfer.approveERC20(
            contractAddress,
            this.LpFarmInfo.pairAddress,
            this.currentAccount.address.Ethereum
        );
        if (res.hash) {
          this.$message({
            message: this.$t("tips.tips14"),
            type: "success",
            duration: 2000,
            offset: 30,
          });
        } else {
          this.$message({
            message: JSON.stringify(res),
            type: "warning",
            offset: 30,
            duration: 2000
          });
        }
        this.showLoading = false;
      } catch (e) {
        console.log(e);
        this.$message({
          message: e.message,
          type: "warning",
          offset: 30,
          duration: 2000
        });
        this.showPop = false;
        this.showLoading = false;
      }
    },
    stakeClick(type) {
      if (type==='stake' && (!this.LpFarmInfo || this.LpFarmInfo && this.LpFarmInfo.poolModelInfo.candyBalance == 0)) return false;
      if (type==='withdraw' && (!this.LpFarmInfo || this.formatDecimals(this.userFarmInfo && this.userFarmInfo.userFarmInfo['1'], this.LpFarmInfo && this.LpFarmInfo.lpDecimals) == 0)) return false;
      this.showStake = true;
      this.stakeType = type;
    }
  },
  beforeDestroy() {
    if (this.farmTimer) {
      clearInterval(this.farmTimer);
      this.farmTimer = null;
    }
  }
}
</script>

<style lang="scss" scoped>
  .mt-12 {
    margin-top: 12px;
  }
  .mt-23 {
    margin-top: 23px;
  }
  .mt-6 {
    margin-top: 60px;
  }
  .banner-cont {
    height: 260px;
    background-color: rebeccapurple;
    border-radius: 20px;
  }
  .farm-total {
    height: 100px;
    border-radius: 20px;
    background-color: #6EB6A9;
  }
  .stake-cont {
    padding: 40px 30px 40px 34px;
    border-radius: 20px;
    border: 1px solid #AAB2C9;
    .calculate-icon {
      height: 30px;
      width: 30px;
      margin-left: 9px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .btn-cont {
      margin-top: 50px;
      .btn-item {
        height: 88px;
        width: 294px;
        text-align: center;
        line-height: 88px;
        font-size: 30px;
        font-weight: 400;
        background-color: #6EB6A9;
        border-radius: 20px;
        color: #FFFFFF;
      }
    }
  }
  .claim-cont {
    padding: 40px 30px 50px 30px;
    border: 1px solid #AAB2C9;
    border-radius: 20px;
    .btn {
      width: 100%;
      margin-top: 50px;
      height: 88px;
      line-height: 88px;
      text-align: center;
      background-color: #6EB6A9;
      color: #FFFFFF;
      border-radius: 20px;
    }
  }
  .calculate-cont {
    // transform: translateY(-90px);
    width: 660px;
    padding: 30px 30px 60px 30px;
    background-color: #FFFFFF;
    border-radius: 20px;
  }
  .icon-cont {
    width: 30px;
    height: 28px;
    margin-left: 9px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .input-cont {
    display: flex;
    padding: 0 30px;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    height: 98px;
    border: 1px solid #AAB2C9;
    border-radius: 10px;
    input {
      flex: 1;
      width: 50px;
      border: none;
      background-color: transparent;
      outline: none;
      font-size: 38px;
      font-weight: 500;
      &::placeholder {
        color: #ABB1BA;
        font-size: 30px;
      }
    }
    span {
      color: #6EB6A9;
      font-size: 26px;
    }
  }
  .down-icon {
    height: 40px;
    width: 40px;
    text-align: center;
    color: #FFFFFF;
    border-radius: 50%;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .m-2_auto {
    margin: 20px auto;
  }
  .m-3_auto {
    margin: 30px auto;
  }
  .exit-icon {
    height: 28px;
    width: 28px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .pop-cont {
    padding: 60px 40px 70px 40px;
    background-color: #FFFFFF;
    min-height: 315px;
    width: 640px;
    border-radius: 20px;
  }
  .btn {
    width: 285px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 30px;
    border: 1px solid #6EB6A9;
    border-radius: 20px;
    color: #6EB6A9;
  }
  .btn_active {
    background: #6EB6A9;
    border: none;
    color: #FFFFFF;
  }
  .coin-info {
    padding: 0 0 40px 40px;
    background-color: #6EB6A9;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .detail-info {
      padding: 22px;
      border-radius: 20px;
      color: #FFFFFF;
      font-weight: bold;
      background-color: #5BA598;
      display: flex;
      align-items: center;
      .icon {
        height: 36px;
        width: 36px;
        border-radius: 50%;
      }
    }
  }
  .active_btn {
    background-color: #ABB1BA !important;
    border: none;
  }
</style>