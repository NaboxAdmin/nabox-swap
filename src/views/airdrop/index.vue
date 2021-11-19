<template>
  <div class="p-3 bg-white">
    <div class="banner-cont">

    </div>
    <div class="farm-total p-2 mt-2">
      <div class="text-left size-22 text-d5">{{ $t("airdrop.airdrop1") }}</div>
      <div class="d-flex direction-column align-items-center mt-12">
        <span class="size-34 font-500 text-white">{{ 26500000 | numFormat }}</span>
        <span class="font-500 text-d5 size-26">≈$200</span>
      </div>
    </div>
    <div class="stake-cont mt-2">
      <div class="d-flex align-items-center space-between">
        <span class="size-28 text-90">{{ $t("airdrop.airdrop2") }} Nabox</span>
        <p class="d-flex align-items-center">
          <span class="text-primary size-28 cursor-pointer">{{ $t("airdrop.airdrop10") }}</span>
          <span class="icon-cont">
            <img src="@/assets/image/link_to.png" alt="">
          </span>
        </p>
      </div>
      <div class="size-34 text-3a font-500 mt-3">{{ 6000000 | numFormat }}</div>
      <div class="mt-12 text-90 size-26">≈50.00</div>
      <div class="mt-3 d-flex align-items-center">
        <span>Nabox-BUSD LP {{ $t("airdrop.airdrop3") }}</span>
        <span class="calculate-icon cursor-pointer" @click="showCalculate=true">
          <img src="@/assets/image/calculator.png" alt="">
        </span>
      </div>
      <div class="size-34 mt-23 text-3a">16.8</div>
      <div class="btn-cont d-flex align-items-center space-between">
        <div class="btn-item cursor-pointer" @click="stakeClick('stake')">{{ $t("airdrop.airdrop4") }}</div>
        <div class="btn-item cursor-pointer" @click="stakeClick('withdraw')">{{ $t("airdrop.airdrop8") }}</div>
      </div>
    </div>
    <div class="claim-cont mt-2">
      <div class="size-28 text-90">{{ $t("airdrop.airdrop5") }} Nabox</div>
      <div class="mt-3 text-3a size-34 font-500">{{ 46200 | numFormat }}</div>
      <div class="size-26 text-90 mt-12">≈18.76</div>
      <div class="btn cursor-pointer" @click="claimClick">{{ $t("airdrop.airdrop6") }}</div>
    </div>
    <pop-up :show="showCalculate">
      <div class="calculate-cont">
        <div class="d-flex justify-content-end">
          <span class="exit-icon" @click.stop="showCalculate=false">
            <svg t="1626838971768" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1604" width="14" height="14"><path d="M602.476163 514.068707l403.54275-403.54275A64.199983 64.199983 0 0 0 913.937795 19.178553l-403.54275 403.54275L110.154008 19.178553A64.199983 64.199983 0 0 0 18.806604 110.525957l403.54275 403.54275-403.54275 403.54275A64.199983 64.199983 0 0 0 110.154008 1004.923434l403.54275-403.54275 403.54275 403.54275a64.199983 64.199983 0 0 0 90.61369-90.613691z" fill="#333333" p-id="1605"></path></svg>
          </span>
        </div>
        <div class="text-left font-500 text-3a size-36">{{ $t("airdrop.airdrop7") }}</div>
        <div class="text-90 size-28 mt-6">{{ $t("airdrop.airdrop9") }} Nabox</div>
        <div class="mt-23 size-34 font-500 text-3a">{{ 2000000 | numFormat }}</div>
        <div class="mt-6 d-flex space-between">
          <span class="size-26 text-90">Nabox-BUSD LP</span>
          <p class="d-flex align-items-center">
            <span class="text-primary size-28 cursor-pointer">{{ $t("airdrop.airdrop10") }}</span>
            <span class="icon-cont">
              <img src="@/assets/image/link_to.png" alt="">
            </span>
          </p>
        </div>
        <div class="input-cont mt-2">
          <input :placeholder="$t('vaults.vaults9')"/>
        </div>
        <div class="down-icon m-3_auto">
          <img src="@/assets/image/swap.png" alt="">
        </div>
        <div class="input-cont">
          <input :placeholder="$t('vaults.vaults9')"/>
          <span class="text-90">{{ $t("Nabox") }}</span>
        </div>
        <div class="down-icon m-2_auto">
          <img src="@/assets/image/swap.png" alt="">
        </div>
        <div class="input-cont">
          <input :placeholder="$t('vaults.vaults9')"/>
          <span class="text-90">{{ $t("BUSD") }}</span>
        </div>
        <div class="d-flex mt-4 space-between">
          <span class="text-90 size-28">{{ $t("airdrop.airdrop11") }}</span>
          <span class="text-3a">4759 Nabox/Block</span>
        </div>
        <div class="d-flex mt-3 space-between">
          <span class="text-90 size-28">{{ $t("airdrop.airdrop12") }}</span>
          <span class="text-3a">6.78 {{ $t("airdrop.airdrop13") }}</span>
        </div>
      </div>
    </pop-up>
    <pop-up :show="showStake">
      <div class="pop-cont">
        <div class="size-36 font-500">{{ stakeType === 'stake' && $t("vaults.vaults4") || $t("vaults.vaults4") }}</div>
        <div class="text-right mt-2 text-90 size-26" v-if="stakeType==='increase'">{{ $t("vaults.vaults5") }}：{{ 0 }}</div>
        <div class="text-right mt-2 text-90 size-26" v-else>{{ $t("vaults.vaults5") }}：{{ 0 }}</div>
        <div class="input-cont">
          <input :placeholder="$t('vaults.vaults9')"
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
export default {
  name: "airdrop",
  components: { PopUp },
  data() {
    return {
      showCalculate: false,
      showStake: true,
      amountMsg: "",
      lpCount: "",
      stakeType: ""
    }
  },
  methods: {
    lpInput() {},
    maxCount() {},
    confirm() {},
    claimClick() {},
    stakeClick(type) {
      this.showStake = true;
      this.stakeType = type;
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
    transform: translateY(-90px);
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
</style>