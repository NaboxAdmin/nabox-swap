const TronWeb = require('tronweb');
// 官方文档地址： https://cn.developers.tron.network/reference#address
import {
  isBeta,
  divisionDecimals,
  timesDecimals,
  Minus,
  Times,
  Division, Plus, TRON
} from '@/api/util';
import { trxWithdrawFee } from '@/config';
const ethers = require('ethers');

const localConfig = JSON.parse(localStorage.getItem('localChainConfig'));
const tronChainConfig = localConfig && localConfig.find(item => item.chain === TRON) || null;
const fullNode = tronChainConfig && tronChainConfig['psUrl'].split('/jsonrpc')[0] || (isBeta ? 'https://api.shasta.trongrid.io' : 'https://api.trongrid.io');
const privateKey = ''; // 138a22c03039e688daa2b7c785d1e8d6b9375d4413e6ea82471b1e7a61701a9d
const customTronWeb = new TronWeb(
  fullNode,
  fullNode,
  fullNode,
  privateKey
);
// customTronWeb.setHeader({ 'TRON-PRO-API-KEY': '1355e44a-205d-4264-b4f6-76a3515aaec4' });

const CROSS_OUT_ABI = [
  'function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)'
];

const CROSS_OUT_ABI_II = [
  {
    'outputs': [{ 'type': 'bool' }],
    'payable': true,
    'inputs': [
      { 'name': 'to', 'type': 'string' },
      { 'name': 'amount', 'type': 'uint256' },
      { 'name': 'ERC20', 'type': 'address' },
      { 'name': 'data', 'type': 'bytes' }
    ],
    'name': 'crossOutII',
    'stateMutability': 'Payable',
    'type': 'Function'
  }
];

const TRC20_ALLOWANCE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

export function generateTronAddress(pub) {
  pub = pub.startsWith('0x') ? pub : '0x' + pub;
  const unCompressPub = ethers.utils.computePublicKey(
    ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(pub), 33),
    false
  );
  const addressArray = customTronWeb.utils.crypto.computeAddress(
    customTronWeb.utils.code.hexStr2byteArray(unCompressPub.slice(2))
  );
  return customTronWeb.address.fromHex(
    customTronWeb.utils.code.byteArray2hexStr(addressArray)
  );
}

class TronLinkApi {
  constructor(pub) {
    if (pub) {
      this.selectedAddress = this.generateAddressByPub(pub);
    } else {
      this.connected = this.isReady();
      this.selectedAddress = this.connected
        ? window.tronWeb.defaultAddress.base58
        : '';
      this.getProvider();
    }
  }

  isReady() {
    return window.tronWeb && window.tronWeb.ready;
  }

  getProvider() {
    if (this.connected) {
      this.provider = window.tronWeb;
    }
  }

  generateAddressByPub(pub) {
    return generateTronAddress(pub);
  }

  async requestAccount() {
    if (this.connected) {
      return window.tronWeb.defaultAddress.base58;
    }
    let address;
    const res = await window.tronWeb.request({
      method: 'tron_requestAccounts'
    });
    if (res.code === 200) {
      address = window.tronWeb.defaultAddress.base58;
    }
    this.selectedAddress = address;
    return address;
  }

  async getBlockHeight() {
    const tronWeb = this.getTronWeb();
    const block = await tronWeb.trx.getCurrentBlock('');
    if (block && block.block_header) {
      // console.log(block.block_header.raw_data.number, 1111)
      return block.block_header.raw_data.number;
    } else {
      throw 'get block error';
    }
    // const height = await tronWeb.trx.getBlockByHash(block.blockID)
    // console.log(height, 96633333)
  }

  getTronWeb(pri) {
    if (this.provider) {
      return this.provider;
    } else {
      if (pri) {
        customTronWeb.setPrivateKey(pri);
      }
      return customTronWeb;
    }
  }

  validAddress(address) {
    if (!address) return true;
    const tronWeb = this.getTronWeb();
    return tronWeb.isAddress(address);
  }

  toHex(address) {
    if (!address) return true;
    const tronWeb = this.getTronWeb();
    return tronWeb.address.toHex(address);
  }

  fromHex(address) {
    if (!address) return true;
    const tronWeb = this.getTronWeb();
    return tronWeb.address.fromHex(address);
  }

  async getBalances(multiCallAddress, user, tokens) {
    const tronWeb = this.getTronWeb();
    const funABI = {
      'outputs': [{ 'name': 'info', 'type': 'uint256[]' }],
      'constant': true,
      'inputs': [{ 'name': '_user', 'type': 'address' }, { 'name': '_tokens', 'type': 'address[]' }],
      'name': 'getBalance',
      'stateMutability': 'view',
      'type': 'function'
    };
    const senderHex = this.toHex('T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb');
    const contractAddressCall = this.toHex(multiCallAddress);
    const params = [];
    params.push({ type: 'address', value: user });
    params.push({ type: 'address[]', value: tokens });
    const tx = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddressCall,
      'getBalance(address,address[])',
      {},
      params,
      senderHex
    );

    const constantResult = tx.constant_result;
    if (!constantResult) {
      return;
    }
    const output = '0x' + constantResult[0];
    const result = tronWeb.utils.abi.decodeParamsV2ByABI(funABI, output);
    console.log(result, 'result');
    if (!result || result.length == 0) {
      return;
    }
    const arr = result[0];
    const values = [];
    for (let i = 0; i < arr.length; i++) {
      values.push(arr[i].toString());
    }
    return values;
  }

  async getTrxBalance(address) {
    // console.log(address, '8777');
    const tronWeb = this.getTronWeb();
    const balance = await tronWeb.trx.getBalance(address);
    return divisionDecimals(balance, 6);
  }

  /**
 * @param address TRX地址
 * @param contractAddress 合约地址
 * @param decimals 资产精度
 * */
  async getTrc20Balance(
    address,
    contractAddress,
    decimals = 6
  ) {
    const tronWeb = this.getTronWeb();
    const parameter = [{ type: 'address', value: address }];
    const tx =
        await tronWeb.transactionBuilder.triggerConfirmedConstantContract(
          // tronWeb.address.toHex(contractAddress),
          contractAddress,
          'balanceOf(address)',
          {},
          parameter,
          this.selectedAddress
        );
    const balance = tx.constant_result[0]; // 十六进制余额
    const balance_bignumber = tronWeb.toBigNumber('0x' + balance).toString();
    // console.log(balance_bignumber, 123)
    return divisionDecimals(balance_bignumber, decimals);
  }

  async sendTrx(to, amount, pri) {
    if (!this.validAddress(to)) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const amount_bigNumber = timesDecimals(amount, 6);
    const tx = await tronWeb.transactionBuilder.sendTrx(
      to,
      amount_bigNumber,
      this.selectedAddress
    );
    const signedTx = await tronWeb.trx.sign(tx);
    return await tronWeb.trx.sendRawTransaction(signedTx);
  }

  async sendTrc20(to, amount, contractAddress, decimals, pri) {
    if (!this.validAddress(to)) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const amount_bigNumber = timesDecimals(amount, decimals);
    const parameter = [
      { type: 'address', value: to },
      { type: 'uint256', value: amount_bigNumber }
    ];
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      tronWeb.address.toHex(contractAddress),
      'transfer(address,uint256)',
      {},
      parameter,
      tronWeb.address.toHex(this.selectedAddress)
    );
    const signedTx = await tronWeb.trx.sign(tx.transaction);
    return await tronWeb.trx.sendRawTransaction(signedTx);
  }

  /** 使用metamask
 * @param to nerve 地址
 * @param amount 转账数量
 * @param multySignAddress 多签地址
 * @param contractAddress 合约地址，trx传空
 * @param decimals 资产精度
 * @param pri
 * */
  async crossOutToNerve(to, amount, multySignAddress, contractAddress, decimals = 6, pri) {
    if (!this.validAddress(multySignAddress) || (contractAddress && !this.validAddress(contractAddress))) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const amount_bigNumber = timesDecimals(amount, decimals);
    // console.log(to, amount, multySignAddress, contractAddress, 9444, amount_bigNumber)
    const isToken = !!contractAddress;
    contractAddress =
        contractAddress || '0x0000000000000000000000000000000000000000';
    // const CROSS_OUT_ABI = ['function crossOut(string to, uint256 amount, address ERC20) public payable returns (bool)']
    /* const parameter = [{type:'string',value: to },{type: 'uint256',value: amount_bigNumber},{type: 'address',value: contractAddress}]
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      tronWeb.address.toHex(multySignAddress),
      'crossOut(string,uint256,address)',
      {},
      parameter,
      tronWeb.address.toHex(this.selectedAddress)
    );
    const signedTx = await tronWeb.trx.sign(tx.transaction)
    const broastTx = await tronWeb.trx.sendRawTransaction(signedTx)
    */
    const instance = await tronWeb.contract().at(multySignAddress);
    // console.log(instance, 132)
    return await instance.crossOut(to, amount_bigNumber, contractAddress).send({
      // feeLimit:100_000_000,
      callValue: isToken ? 0 : amount_bigNumber,
      shouldPollResponse: false
    });
  }

  async crossOutToNerveII(params, pri) {
    const { nerveAddress, numbers: amount, multySignAddress, contractAddress, decimals = 6, orderId, crossChainFee } = params;
    if (!this.validAddress(multySignAddress) || (contractAddress && !this.validAddress(contractAddress))) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const amount_bigNumber = timesDecimals(amount, decimals);
    const mainAssetValue = timesDecimals(crossChainFee, 6);
    const isToken = !!contractAddress;
    const instance = await tronWeb.contract().at(multySignAddress);
    return await instance.crossOutII(nerveAddress, amount_bigNumber, contractAddress || '0x0000000000000000000000000000000000000000', orderId).send({
      callValue: isToken ? mainAssetValue : Plus(amount_bigNumber, mainAssetValue),
      shouldPollResponse: false
    });
  }

  /** 手动转入方式
 * @param amount 转账数量
 * @param multySignAddress 多签地址
 * @param contractAddress 合约地址，trx传空
 * @param decimals 资产精度
 * @param pri
 * */
  async crossOutToNerveManual(
    amount,
    multySignAddress,
    contractAddress,
    decimals = 6,
    pri
  ) {
    if (contractAddress) {
      return this.sendTrc20(
        multySignAddress,
        amount,
        contractAddress,
        decimals,
        pri
      );
    } else {
      return this.sendTrx(multySignAddress, amount, pri);
    }
  }

  /**
 * @desc 查询token授权情况
 * @param address TRX地址
 * @param multySignAddress 多签地址
 * @param contractAddress 合约地址
 * @param pri
 * */
  async getTrc20Allowance(address, multySignAddress, contractAddress, pri) {
    const tronWeb = this.getTronWeb(pri);
    const instance = await tronWeb.contract(
      TRC20_ALLOWANCE_ABI,
      contractAddress
    );
      // console.log(instance, 9696)
    const allowance = await instance
      .allowance(address, multySignAddress)
      .call();
    const baseAllowance = '39600000000000000000000000000';
    return Minus(baseAllowance, allowance.toString()) >= 0;
  }

  async approveTrc20(address, multySignAddress, contractAddress, pri) {
    if (
      !this.validAddress(multySignAddress) ||
        (contractAddress && !this.validAddress(contractAddress))
    ) {
      throw 'invalid address';
    }
    const tronWeb = this.getTronWeb(pri);
    const instance = await tronWeb.contract().at(contractAddress);
    const approveAmount = tronWeb
      .toBigNumber(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      .toFixed();
    return await instance.approve(multySignAddress, approveAmount).send({
      // feeLimit:100_000_000,
      callValue: 0,
      shouldPollResponse: false
    });
  }

  async triggerSmartContract(params) {
    const tronWeb = this.getTronWeb();
    const { to, functionName, options, parameter, fromAddress } = params;
    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(to), functionName, options, parameter, fromAddress);
    const signedTx = await tronWeb.trx.sign(transaction.transaction);
    return await tronWeb.trx.sendRawTransaction(signedTx);
  }

  calWithdrawalNVT(nvtUSD, heterogeneousChainUSD) {
    const defaultTRX = divisionDecimals(trxWithdrawFee, 6);
    console.log(defaultTRX, 'defaultTRX');
    const nvtAmount = Division(
      Times(heterogeneousChainUSD, defaultTRX),
      nvtUSD
    ).toFixed();
      // @ts-ignore
    return Math.ceil(nvtAmount);
  }

  async getPubBySign(message) {
    const tronWeb = this.getTronWeb();
    const messageHex = tronWeb.toHex(message);
    const signature = await tronWeb.trx.sign(messageHex);
    const TRX_MESSAGE_HEADER = '\x19TRON Signed Message:\n32';
    const messageBytes = [
      ...ethers.utils.toUtf8Bytes(TRX_MESSAGE_HEADER),
      ...ethers.utils.arrayify(messageHex)
    ];
    const msgHash = ethers.utils.keccak256(messageBytes);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const recoveredPubKey = ethers.utils.recoverPublicKey(
      msgHashBytes,
      signature
    );
    if (recoveredPubKey.startsWith('0x04')) {
      const compressPub = ethers.utils.computePublicKey(recoveredPubKey, true);
      return compressPub.slice(2);
    } else {
      throw 'Sign error';
    }
  }
}

export default TronLinkApi;
