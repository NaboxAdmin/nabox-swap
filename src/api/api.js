import nuls from "nuls-sdk-js";
import nerve from "nerve-sdk-js";
import {ethers} from "ethers";
import sdk from "nerve-sdk-js/lib/api/sdk";
import {Plus, htmlEncode, timesDecimals, Minus} from "./util";
import {request} from "./https";
import { ETHNET } from "@/config"
const Signature = require("elliptic/lib/elliptic/ec/signature");
const txsignatures = require("nerve-sdk-js/lib/model/txsignatures");
import BufferReader from "nerve-sdk-js/lib/utils/bufferreader";
import txs from "nerve-sdk-js/lib/model/txs";

// NULS NERVE跨链手续费
export const crossFee = 0.01;
const nSdk = {NERVE: nerve, NULS: nuls};

export class NTransfer {

  constructor(props) {
    if (!props.chain) {
      throw "未获取到交易网络，组装交易失败";
    }
    this.chain = props.chain; //链网络
    this.type = props.type; //交易类型
    this.sdk = nSdk[this.chain] || nerve; // nerve nuls sdk
  }

  async getTxHex(data) {
    const {inputs, outputs, txData, remarks = "", pub, signAddress, tAssemble: temptAssemble} = data;
    // 组装交易
    const tAssemble = temptAssemble || this.sdk.transactionAssemble(inputs, outputs, htmlEncode(remarks), this.type, txData);
    // 调用metamask签名hash，然后拼接公钥完成交易签名
    const hash = "0x" + tAssemble.getHash().toString("hex");
    let flat = await window.ethereum.request({
      method: "eth_sign",
      params: [signAddress, hash]
    })
    // console.log(flat, 66, signAddress)
    flat = flat.slice(2) // 去掉0x
    const r = flat.slice(0, 64);
    const s = flat.slice(64, 128);
    // const recoveryParam = flat.slice(128)
    let signature = new Signature({r, s}).toDER("hex");
    // signature = signature.slice(2)

    const signData = this.sdk.appSplicingPub(signature, pub);
    tAssemble.signatures = signData;
    const txHex = tAssemble.txSerialize().toString("hex");
    return txHex
  }

  async appendSignature(data) {
    const { pub, signAddress, txHexForSign } = data;
    const bufferReader = new BufferReader(Buffer.from(txHexForSign, "hex"), 0);
    // 反序列回交易对象
    const tAssemble = new txs.Transaction();
    tAssemble.parse(bufferReader);
    const hash = "0x" + tAssemble.getHash().toString("hex");

    /* //初始化签名对象
    const txSignData = new txsignatures.TransactionSignatures();
    // // 反序列化签名对象
    const reader = new BufferReader(tAssemble.signatures, 0);
    txSignData.parse(reader); */

    let flat = await window.ethereum.request({
      method: "eth_sign",
      params: [signAddress, hash]
    })
    // console.log(flat, 66, signAddress)
    flat = flat.slice(2) // 去掉0x
    const r = flat.slice(0, 64);
    const s = flat.slice(64, 128);
    // const recoveryParam = flat.slice(128)
    let signature = new Signature({r, s}).toDER("hex");
    // signature = signature.slice(2)
    // const signData = this.sdk.appSplicingPub(signature, pub);

    //初始化签名对象
    const txSignData = new txsignatures.TransactionSignatures();
    // // 反序列化签名对象
    const reader = new BufferReader(tAssemble.signatures, 0);
    txSignData.parse(reader);
    // 追加签名到对象中
    txSignData.addSign(Buffer.from(pub, "hex"), Buffer.from(signature, 'hex'));
    /* txSignData.signatures.push({
      pubkey: pub,
      signData
    }) */
    tAssemble.signatures = txSignData.serialize();
    // tAssemble.signatures = signData;
    const txHex = tAssemble.txSerialize().toString("hex");
    return txHex
  }

  async inputsOrOutputs(data) {
    if (!this.type) {
      throw "获取交易类型失败";
    }
    if (this.type === 2) {
      //链内交易
      return this.transferTransaction(data);
    } else if (this.type === 10) {
      //跨链交易
      return this.crossChainTransaction(data);
    } else if (this.type === 16) {
      //调用合约
      if (this.chain !== "NULS") {
        throw "nerve网络不支持合约操作";
      }
      return this.callContractTransaction(data);
    } else if (this.type === 43) {
      // nerve 网络提现到eth bsc
      return this.WithdrawalTransaction(data);
      /* const assetNerveInfo = await this.getAssetNerveInfo(data);
      if (assetNerveInfo) {
        data.assetsChainId = assetNerveInfo.chainId;
        data.assetsId = assetNerveInfo.assetId;
        return this.WithdrawalTransaction(data);
      } else {
        throw "获取该资产在nerve链上信息失败";
      } */
    }
  }

  //nuls nerve普通转账input output
  async transferTransaction(transferInfo) {
    const inputs = [], outputs = [];
    //转账资产nonce
    const nonce = await this.getNonce(transferInfo);
    if (!nonce) throw localStorage.getItem('locale') === 'en' ? 'Failed to get the nonce value' : "获取nonce值失败";
    const config = JSON.parse(sessionStorage.getItem("config"));
    const mainAsset = config[this.chain];
    if (mainAsset.chainId === transferInfo.assetsChainId && mainAsset.assetId === transferInfo.assetsId) {
      // 转账资产为本链主资产, 将手续费和转账金额合成一个input
      const newAmount = Plus(transferInfo.amount, transferInfo.fee).toFixed();
      inputs.push({
        address: transferInfo.from,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: newAmount,
        locked: 0,
        nonce: nonce
      });
    } else {
      const mainAssetNonce = await this.getNonce({
        from: transferInfo.from,
        assetsChainId: mainAsset.chainId,
        assetsId: mainAsset.assetId
      });
      inputs.push({
        address: transferInfo.from,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.amount,
        locked: 0,
        nonce:  transferInfo.nonce || nonce // 闪兑资产和跨链资产一样，闪兑后nonce值使用hash后16位
      });
      inputs.push({
        address: transferInfo.from,
        assetsChainId: mainAsset.chainId,
        assetsId: mainAsset.assetId,
        amount: transferInfo.fee,
        locked: 0,
        nonce: mainAssetNonce
      });
    }
    outputs.push({
      address: transferInfo.to,
      assetsChainId: transferInfo.assetsChainId,
      assetsId: transferInfo.assetsId,
      amount: transferInfo.amount,
      lockTime: 0
    });
    return {inputs, outputs};
  }

  // nuls nerve跨链转账input output
  async crossChainTransaction(transferInfo) {
    const {inputs, outputs} = await this.transferTransaction(transferInfo);
    const CROSS_INFO = JSON.parse(sessionStorage.getItem("config"))["NULS"];
    if (this.chain === "NERVE") {
      // nerve资产跨链到nuls,要收取nuls手续费
      let isNULS = false;
      const fee = timesDecimals(crossFee, 8);
      for (let input of inputs) {
        if (input.assetsChainId === CROSS_INFO.chainId && input.assetsId === CROSS_INFO.assetId) {
          //跨链资产为nuls
          isNULS = true;
          input.amount = Plus(input.amount, fee).toFixed();
        }
      }
      if (!isNULS) {
        // 跨链资产不是nuls
        const nonce = await this.getNonce({
          from: transferInfo.from,
          assetsChainId: CROSS_INFO.chainId,
          assetsId: CROSS_INFO.assetId
        });
        console.log("nonce*************");
        console.log(nonce);
        if (!nonce) {
          return {
            success: false,
            data: {from: transferInfo.from, assetsChainId: CROSS_INFO.chainId, assetsId: CROSS_INFO.assetId}
          };
        }
        inputs.push({
          address: transferInfo.from,
          assetsChainId: CROSS_INFO.chainId,
          assetsId: CROSS_INFO.assetId,
          amount: fee,
          locked: 0,
          nonce: nonce
        });
      }
    }
    return {inputs, outputs};
  }

  // 调用合约交易
  async callContractTransaction(transferInfo) {
    // console.log("callContractTransaction:");
    // console.log(transferInfo);
    const nonce = await this.getNonce(transferInfo);
    // const defaultFee = timesDecimals(0.001, 8);
    const defaultFee = 0;
    const inputs = [
      {
        address: transferInfo.from,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: Plus(transferInfo.amount, defaultFee).toFixed(),
        locked: 0,
        nonce: nonce
      }
    ];
    const outputs = [];
    if (transferInfo.toContractValue) {
      outputs.push({
        address: transferInfo.to,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        amount: transferInfo.toContractValue,
        lockTime: 0
      });
    }
    return {inputs, outputs};
  }

  // nerve 提现
  async WithdrawalTransaction(transferInfo) {
    //console.log(transferInfo, 8888);
    const config = JSON.parse(sessionStorage.getItem("config"));
    const mainAsset = config.NERVE;
    let nonce;
    if (transferInfo.nonce) {
      nonce = transferInfo.nonce
    } else {
      nonce = await this.getNonce(transferInfo);
    }
    // const nonce = await this.getNonce(transferInfo);
    let inputs = [];
    const totalFee = Number(Plus(transferInfo.proposalPrice, transferInfo.fee));
    const { feeAsset, from } = transferInfo;
    if (
        feeAsset.chainId === transferInfo.assetsChainId &&
        feeAsset.assetId === transferInfo.assetsId
    ) {
      const newAmount = Number(Plus(transferInfo.amount, totalFee));
      inputs.push({
        address: transferInfo.from,
        amount: newAmount,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        nonce: nonce,
        locked: 0
      });
    } else {
      const feeAssetNonce = await this.getNonce({
        from,
        assetsChainId: feeAsset.chainId,
        assetsId: feeAsset.assetId
      });
      inputs = [
        {
          address: from,
          amount: transferInfo.amount,
          assetsChainId: transferInfo.assetsChainId,
          assetsId: transferInfo.assetsId,
          nonce: nonce,
          locked: 0
        },
        {
          address: from,
          amount: totalFee,
          assetsChainId: feeAsset.chainId,
          assetsId: feeAsset.assetId,
          nonce: feeAssetNonce,
          locked: 0
        }
      ];
    }
    // 系统补贴手续费地址
    const feeAddress = mainAsset.config.feeAddress;
    const blockHoleAddress = mainAsset.config.destroyAddress;
    let outputs = [
      {
        address: blockHoleAddress, //黑洞地址
        amount: transferInfo.amount,
        assetsChainId: transferInfo.assetsChainId,
        assetsId: transferInfo.assetsId,
        locked: 0
      },
      {
        address: feeAddress, //提现费用地址
        amount: transferInfo.proposalPrice,
        assetsChainId: feeAsset.chainId,
        assetsId: feeAsset.assetId,
        locked: 0
      }
    ];
    return {inputs, outputs};
  }

  async getNonce(info) {
    try {
      let data = {
        chain: this.chain,
        address: info.from,
        chainId: info.assetsChainId,
        assetId: info.assetsId,
        refresh: true
      };
      // console.log(data);
      const res = await request({url: "/wallet/address/asset", data: data});
      // console.log(res);
      if (res.code === 1000) {
        return res.data.nonce;
      }
      return null;
    } catch (e) {
      console.error(e);
    }
  }
  // 获取资产上面的nerve信息
  async getAssetNerveInfo(data) {
    //console.log(data, 888999)
    let result = null;
    let params = {};
    if (data.contractAddress) {
      const config = JSON.parse(sessionStorage.getItem("config"));
      const mainAsset = config[data.fromChain]; //来源链(eth,bnb,heco)主资产信息
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

}


// const RPC_URL = {
//   BSC: {
//     ropsten: "https://data-seed-prebsc-1-s1.binance.org:8545/",
//     homestead: "https://bsc-dataseed.binance.org/"
//   },
//   Heco: {
//     ropsten: "https://http-testnet.hecochain.com",
//     homestead: "https://http-mainnet.hecochain.com"
//   },
//   OKExChain: {
//     ropsten: "https://exchaintestrpc.okex.org",
//     homestead: "https://exchainrpc.okex.org"
//   }
// };

const CROSS_OUT_ABI = [
  "function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)"
];
// token授权
const ERC20_ABI = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)"
];

// 查询余额
const erc20BalanceAbiFragment = [{
  "constant": true,
  "inputs": [{"name": "", "type": "address"}],
  "name": "balanceOf",
  "outputs": [{"name": "", "type": "uint256"}],
  "type": "function"
}]

// token转账
const erc20TransferAbiFragment = [{
  name: "transfer",
  type: "function",
  inputs: [{"name": "_to", "type": "address"}, {"type": "uint256", "name": "_tokens"}],
  constant: false,
  outputs: [],
  payable: false
}];

export class ETransfer {

  constructor(props = {}) {
    this.getProvider(props.chain)
    // this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  getProvider(chain) {
    let RPC_URL = {};
    const supportChainList = sessionStorage.getItem('supportChainList') && JSON.parse(sessionStorage.getItem('supportChainList')) || [];
    supportChainList.forEach(chain => {
      if (chain.chainType === 2) {
        RPC_URL[chain.chain] = {
          ropsten: chain.rpcUrl,
          homestead: chain.rpcUrl
        }
      }
    });
    if (!chain) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      if (chain === "Ethereum") {
        this.provider = ethers.getDefaultProvider(ETHNET);
      } else {
        this.provider =  new ethers.providers.JsonRpcProvider(RPC_URL[chain][ETHNET]);
      }
    }
  }

  decodeData(data) {
    /* const commonTransferABI = ["function transfer(address recipient, uint256 amount)"] // eth等链发起的交易
    // CROSS_OUT_ABI nerve链发起的跨链转入交易
    const ABI = fromNerve ? CROSS_OUT_ABI : commonTransferABI
    const iface = new ethers.utils.Interface(ABI);  */
    const iface = new ethers.utils.Interface(["function transfer(address recipient, uint256 amount)"]);
    const txInfo = iface.parseTransaction({data});
    //const decode = iface.functions["transfer(address,uint256)"].decode(data);
    // const decode = iface.decodeFunctionData("transfer(address,uint)", data);
    if (txInfo) {
      return {to: txInfo.args[0], amount: txInfo.args[1].toString()};
    }
    return null;
  }

  formatEther(value) {
    return ethers.utils.formatEther(value);
  }

  /**
   * metamask 跨链转入nerve
   * @param multySignAddress 多签地址
   * @param nerveAddress nerve地址
   * @param numbers 交易数量
   * @param fromAddress metamask地址
   * @param contractAddress ERC20合约地址
   * @param decimals token精度
   * 
   */
  async crossIn(params) {
    const { multySignAddress, nerveAddress, numbers, fromAddress, contractAddress, decimals } = params;
    let transactionParameters;
    if (contractAddress) {
      // token 转入
      const numberOfTokens = ethers.utils.parseUnits(numbers, decimals);
      const iface = new ethers.utils.Interface(CROSS_OUT_ABI);
      const data = iface.functions.crossOut.encode([nerveAddress, numberOfTokens, contractAddress]);
      transactionParameters = {
        to: multySignAddress,
        from: fromAddress, //验证合约调用需要from,必传
        value: '0x00',
        data: data
      };
    } else {
      const amount = ethers.utils.parseEther(numbers);
      const iface = new ethers.utils.Interface(CROSS_OUT_ABI);
      const data = iface.functions.crossOut.encode([nerveAddress, amount, '0x0000000000000000000000000000000000000000']);
      transactionParameters = {
        to: multySignAddress,
        value: amount,
        data: data
      };
    }
    const failed = await this.validate(transactionParameters);
    if (failed) {
      console.error('failed approveERC20' + failed);
      return {success: false, msg: 'failed crossIn' + failed}
    }
    if (transactionParameters.from) {
      delete transactionParameters.from;
    }
    return await this.sendTransaction(transactionParameters)
  }

  // 普通链内转账
  async commonTransfer(params) {
    const wallet = await this.provider.getSigner();
    const nonce = await wallet.getTransactionCount();
    if (params.contractAddress) {
      const contract = new ethers.Contract(params.contractAddress, erc20TransferAbiFragment, wallet);
      const numberOfTokens = ethers.utils.parseUnits(params.value, params.decimals);
      const transaction = { nonce };
      /* console.log("to: ", params.to)
      console.log("numberOfTokens: ", numberOfTokens)
      console.log("transaction: ", transaction) */
      return await contract.transfer(params.to, numberOfTokens, transaction);
    } else {
      // 非token转账
      const value = ethers.utils.parseEther(params.value);
      const transaction = {nonce, to: params.to, value};
      /* if (params.upSpeed) {
        transaction.gasPrice = await this.getSpeedUpGasPrice();
      } */
      // console.log("transaction: ", transaction)
      return await wallet.sendTransaction(transaction);
    }
  }

  getEthBalance(address) {
    let balancePromise = this.provider.getBalance(address);
    return balancePromise.then((balance) => {
      return ethers.utils.formatEther(balance)
    }).catch(e => {
      // console.error('获取余额失败' + e)
      throw new Error("获取余额失败" + e)
    });
  }

  /**
 * ERC20合约余额
 * @param contractAddress ERC20合约地址
 * @param tokenDecimals token小数位数
 * @param address 账户地址
 */
  getERC20Balance(contractAddress, tokenDecimals, address) {
    let contract = new ethers.Contract(contractAddress, erc20BalanceAbiFragment, this.provider);
    let balancePromise = contract.balanceOf(address);
    return balancePromise.then((balance) => {
      return ethers.utils.formatUnits(balance, tokenDecimals);
    }).catch(e => {
      // console.error('获取ERC20余额失败' + e)
      throw new Error("获取余额失败" + e)
    });
  }

  //验证交易参数
  async validate(tx) {
    try {
      const result = await this.provider.call(tx);
      return ethers.utils.toUtf8String("0x" + result.substr(138));
    } catch (e) {
      return false;
    }
  }

  async sendTransaction(tx) {
    const wallet = this.provider.getSigner();
    return await wallet.sendTransaction(tx);
  }


  /**
   * 查询erc20资产授权额度
   * @param contractAddress ERC20合约地址
   * @param multySignAddress 多签地址
   * @param address 账户eth地址
   */
  async getERC20Allowance(contractAddress, multySignAddress, address) {
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, this.provider);
    const allowancePromise = contract.allowance(address, multySignAddress);
    return allowancePromise
      .then(allowance => {
        const baseAllowance = "39600000000000000000000000000";
        //已授权额度小于baseAllowance，则需要授权
        return Minus(baseAllowance, allowance) >= 0;
      })
      .catch(e => {
        console.error("获取erc20资产授权额度失败" + e);
        return true;
      });
  }

  async approveERC20(contractAddress, multySignAddress, address) {
    const iface = new ethers.utils.Interface(ERC20_ABI);
    const data = iface.functions.approve.encode([multySignAddress, new ethers.utils.BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')]);
    const transactionParameters = {
      to: contractAddress,
      from: address,
      value: '0x00',
      data: data,
    };
    const failed = await this.validate(transactionParameters);
    if (failed) {
      console.error('failed approveERC20' + failed);
      return {success: false, msg: 'failed approveERC20' + failed}
    }
    delete transactionParameters.from;   //etherjs 4.0 from参数无效 报错
    return this.sendTransaction(transactionParameters)
  }
  // 获取手续费
  getGasPrice(gasLimit) {
    return this.provider.getGasPrice().then(gasPrice => {
      return ethers.utils.formatEther(gasPrice.mul(gasLimit).toString()).toString();
    });
  }

  // 加速手续费
  async getSpeedUpFee(gasLimit) {
    const gasPrice = await this.getSpeedUpGasPrice();
    return ethers.utils.formatEther(gasPrice.mul(gasLimit).toString()).toString();
  }

  // 加速gasprice
  getSpeedUpGasPrice() {
    const GWEI_10 = ethers.utils.parseUnits("10", 9);
    return this.provider.getGasPrice().then(gasPrice => {
      return gasPrice.add(GWEI_10);
    });
  }

  /**
   * 提现默认手续费--nvt
   * @param nvtUSD    nvt的USDT价格
   * @param heterogeneousChainUSD    异构链币种的USDT价格
   * @param isToken   是否token资产
   */
  async calWithdrawalNVTFee(nvtUSD, heterogeneousChainUSD, isToken) {
    // console.log(nvtUSD, heterogeneousChainUSD, isToken);
    const gasPrice = await this.getWithdrawGas();
    let gasLimit;
    if (isToken) {
      gasLimit = new ethers.utils.BigNumber("210000");
    } else {
      gasLimit = new ethers.utils.BigNumber("190000");
    }
    const nvtUSDBig = ethers.utils.parseUnits(nvtUSD, 6);
    const ethUSDBig = ethers.utils.parseUnits(heterogeneousChainUSD, 6);
    const result = ethUSDBig.mul(gasPrice).mul(gasLimit).div(ethers.utils.parseUnits(nvtUSDBig.toString(), 10));
    // console.log('result: ' + result.toString());
    const numberStr = ethers.utils.formatUnits(result, 8).toString();
    const ceil = Math.ceil(numberStr);
    // console.log('ceil: ' + ceil);
    const finalResult = ethers.utils.parseUnits(ceil.toString(), 8);
    // console.log('finalResult: ' + finalResult);
    return finalResult;
  }

  // 提现gas
  getWithdrawGas() {
    return this.provider.getGasPrice().then(gasPrice => {
      return gasPrice;
    });
  }

  /**
   * @param mainAssetUSD 提现网络主资产USD
   * @param feeUSD 手续费USD
   * @param isToken 提现资产是否是token
   * @param feeDecimals 手续费精度
   * @param isMainAsset 手续费是否是提现网络主资产
   * @param isNVT 手续费是否是NVT
   * */
  async calWithdrawFee(mainAssetUSD, feeUSD, isToken, feeDecimals, isMainAsset, isNVT) {
    const gasPrice = await this.getWithdrawGas();
    let gasLimit;
    if (isToken) {
      gasLimit = new ethers.utils.BigNumber("210000");
    } else {
      gasLimit = new ethers.utils.BigNumber("190000");
    }
    if (isMainAsset) {
      return this.formatEthers(gasLimit.mul(gasPrice), feeDecimals);
    }
    const feeUSDBig = ethers.utils.parseUnits(feeUSD.toString(), 6);
    const mainAssetUSDBig = ethers.utils.parseUnits(mainAssetUSD.toString(), 6);
    let result = mainAssetUSDBig
        .mul(gasPrice)
        .mul(gasLimit)
        .mul(ethers.utils.parseUnits("1", feeDecimals))
        .div(ethers.utils.parseUnits("1", 18))
        .div(feeUSDBig);
    if (isNVT) {
      // 如果是nvt，向上取整
      const numberStr = ethers.utils.formatUnits(result, feeDecimals);
      const ceil = Math.ceil(numberStr);
      result = ethers.utils.parseUnits(ceil.toString(), feeDecimals).toString();
    }
    return this.formatEthers(result, feeDecimals);
  }

  formatEthers(amount, decimals) {
    return ethers.utils.formatUnits(amount, decimals).toString();
  }

  /**
   * 通过自定义的eth/bnb数量 计算出相应的nvt数量
   * @param nvtUSD                            nvt的USDT价格
   * @param number                           异构链币种数量
   * @param heterogeneousChainUSD      异构链币种的USDT价格
   */
  calNvtByEth(nvtUSD, number, heterogeneousChainUSD) {
    let ethAmount = ethers.utils.parseEther(number);
    // console.log('ethAmount: ' + ethAmount.toString());
    let nvtUSDBig = ethers.utils.parseUnits(nvtUSD, 6);
    let ethUSDBig = ethers.utils.parseUnits(heterogeneousChainUSD, 6);
    let result = ethAmount.mul(ethUSDBig).div(ethers.utils.parseUnits(nvtUSDBig.toString(), 10));
    // console.log('result: ' + result.toString());
    // console.log('result format: ' + ethers.utils.formatUnits(result, 8));
    let numberStr = ethers.utils.formatUnits(result, 8).toString();
    let ceil = Math.ceil(numberStr);
    // console.log('ceil: ' + ceil);
    let finalResult = ethers.utils.parseUnits(ceil.toString(), 8);
    // console.log('finalResult: ' + finalResult);
    return finalResult.toString();
  }
}

export async function getSymbolUSD(chain) {
  const res = await request({
    url: "/asset/main/price",
    data: {chain}
  });
  if (res.code === 1000) {
    return res.data;
  }
  return null;
}

export const swapScale = 1.1

export const swapSymbolConfig = {
  ETH: "ETH",
  BNB: "BNB(BSC)",
  HT: "HT(HECO)",
  OKT: "OKT(OKT)",
  NULS: "NULS"
}
