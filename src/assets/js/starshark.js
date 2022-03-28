import { StarSharkBSC, StarSharkSea, StarSharkSss } from "@/assets/js/contract";
import { sleep } from "@/assets/js/function";
import axios from "axios";
import Web3 from "web3/dist/web3.min";

export default class StarShark {
  constructor(setLoadAlert) {
    this.sharkLink = 'https://starsharks.com/go/api/market/shark-detail?shark_id='
    this.setLoadAlert = setLoadAlert
    this.web3 = new Web3("https://bsc-dataseed.binance.org/")
    this.contract = new this.web3.eth.Contract(
      StarSharkBSC.abi, StarSharkBSC.address,
      (err) => {
        if (err) throw [new Date().toString(), 'contract starShark', err];
      }
    )
    this.contractSea = new this.web3.eth.Contract(
      StarSharkSea.abi, StarSharkSea.address,
      (err) => {
        if (err) throw [new Date().toString(), 'contract starSharkSea', err];
      }
    )
    this.contractSss = new this.web3.eth.Contract(
      StarSharkSss.abi, StarSharkSss.address,
      (err) => {
        if (err) throw [new Date().toString(), 'contract starSharkSss', err];
      }
    )
  }

<<<<<<< Updated upstream
=======
  initSetLoadAlert(setLoadAlert) {
    this.setLoadAlert = setLoadAlert
  }

  getSharkLink(shark_id, account) {
    let link = this.sharkLink + shark_id
    if (account !== undefined)
      link += '&account=' + account
    return link
  }

>>>>>>> Stashed changes
  //获取账号鲨鱼
  async getSharkIDs(address) {
    let amount = await this.contract.methods.balanceOf(address).call(),
      amount2done = 0
    amount = parseInt(amount), amount2done = parseInt(amount)
    let sharkIDs = []
    if (amount > 0) {
      for (let i = 0; i < amount; i++) {
        try {
          this.contract.methods.tokenOfOwnerByIndex(address, i).call().then(sharkID => {
            sharkIDs.push(sharkID)
          })
        } catch (error) {
          console.error(error)
          amount2done--
        }
      }
    }
    while (sharkIDs.length < amount2done) {
      await sleep(200)
    }
    return sharkIDs
  }

  //获取账号余额
  async getAccountBalance(data) {
    let address = data.address
    this.setLoadAlert(`Getting account (${data.name}) Balance`)
    let amountBNB = await this.web3.eth.getBalance(address)
    amountBNB = parseFloat(this.web3.utils.fromWei(amountBNB)).toFixed(8)
    let amountSea = await this.contractSea.methods.balanceOf(address).call()
    amountSea = parseFloat(this.web3.utils.fromWei(amountSea)).toFixed(8)
    let amountSss = await this.contractSss.methods.balanceOf(address).call()
    amountSss = parseFloat(this.web3.utils.fromWei(amountSss)).toFixed(8)
    let amountSeaInGame = null
    if (data.authorization != undefined && data.exp * 1000 > Date.now()) {
      let d = await this.getBaseAccData(data.authorization)
      d = d.data.data
      amountSeaInGame = d.amount
    }
    return {
      BNB: `${amountBNB} BNB`,
      SEA: `${amountSea} SEA`,
      SSS: `${amountSss} SSS`,
      SeaInGame: amountSeaInGame === null ? '--' : `${amountSeaInGame} SEA`
    }
  }

  //获取鲨鱼数据
  async getSharkDetail(data) {
    let SharkIDs = await this.getSharkIDs(data.address)
    let mySharks = []
    for (const key in SharkIDs) {
      this.setLoadAlert(`Getting account (${data.name}) shark data: ${parseInt(key) + 1}/${SharkIDs.length} (${SharkIDs[key]})`)
      let shark = await axios.get(this.getSharkLink(SharkIDs[key], data.address))
      if (typeof shark == 'string') {
        shark = JSON.parse(shark)
      }
      let sheet = shark.data.data.sheet
      shark = shark['data']['data']['attr']
      shark['sheet'] = sheet
      mySharks.push(shark)
    }
    mySharks.sort((a, b) => a.shark_id - b.shark_id)
    mySharks.sort((a, b) => b.star - a.star)
    return mySharks
  }

  //获取多个账号数据
  async getMultiAccSharks(savedAddress) {
    let allAcc = {}
    for (const key in savedAddress) {
      this.setLoadAlert(`Getting account (${savedAddress[key].name}) sharkIDs`)
      allAcc[savedAddress[key].address] = {
        accData: savedAddress[key],
        balanceData: await this.getAccountBalance(savedAddress[key]),
        sharkData: await this.getSharkDetail(savedAddress[key])
      }
    }
    return allAcc
  }
}