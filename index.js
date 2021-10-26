const Web3 = require('web3')
const express = require('express')
const abi = require('./abi.json')
const cors = require('cors')

// var coder = require('web3/lib/solidity/coder')  
// var CryptoJS = require('crypto-js')  


const app = express()
app.use(cors())
const port = 3000

// var privateKey = Buffer(myPrivateKey, 'hex')
const web3 = new Web3( 'wss://rinkeby.infura.io/ws/v3/08bf722966564ea182c198253fd055ad' )
// web3.eth.accounts.wallet.add(privateKey)
// web3.eth.defaultAccount = '0x2525A98fFB273Fe93089d25a43e929C6379d3336'
// let walletOwnerAddress = '0x' + ethUtils.privateToAddress(ethUtils.toBuffer('0x' + this.pkey)).toString('hex')


app.get('/', (req, res) => {
    res.send("sonha hello 👋")
})

app.get('/:walletaddress', (req, res) => {
    let walletAddress = req.params.walletaddress
    let coinInfo = getWalletAddress(walletAddress)
    coinInfo.then((data) => res.json({ 
        "name": data[0],
        "symbol": data[1],
        "balance": data[2]
    }))
    getInfo()
})

app.get('/:walletaddress/:receive/:amount', (req, res) => {
    let walletAddress = req.params.walletaddress
    let receiveAdd = req.params.receive
    let amount = parseInt(req.params.amount)

    let isSuccess = transfer(walletAddress, receiveAdd, amount)
    
    res.json({
        "message": isSuccess,

    })
})

const getWalletAddress = async (address) => {
    const contract = await new web3.eth.Contract(abi.abi, address)

    const name = await contract.methods.name().call()
    const symbol = await contract.methods.symbol().call()
    const balanceOf = await contract.methods.balanceOf(address).call()

    return [name, symbol, balanceOf]
}

const getInfo = async () => {
    web3.eth.getBlockNumber().then(console.log)
}

const transfer = async (fromAddress, toAddress, amount) => {
    const contract = await new web3.eth.Contract(abi.abi, fromAddress)

    const isSuccess = contract.methods.transferFrom(fromAddress, toAddress, amount).send({
        from: fromAddress
    })

    return isSuccess
}

app.listen(port, ()=> {
    console.log(`Listen on port ${port}`)
})