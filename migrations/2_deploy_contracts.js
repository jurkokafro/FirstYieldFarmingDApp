const Tether = artifacts.require('Tether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')


module.exports = async function(deployer, network, accounts) {
    //Deploy Mock Tether Contract
    await deployer.deploy(Tether)
    const tether = await Tether.deployed()

    //Deploy Mock Tether Contract
    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    //Deploy Mock Tether Contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address)
    const decentralBank = await DecentralBank.deployed()

    //Transfer all RWD tokens to Decentral Bank
    //brez await bo sel program dalje, tudi ce se funkcija ne izvede oz
    //se izvede kasneje
    await rwd.transfer(decentralBank.address, '1000000000000000000000000')

    //100 tether tokens to our investors
    await tether.transfer(accounts[1], '100000000000000000000') 

}