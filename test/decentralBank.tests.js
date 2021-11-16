
const RWD = artifacts.require('RWD')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }
    function assertEqual(a, b, c) {
        if(a==b) return true
        else throw new Error(c + ' A: ' + a + ' B:' + b)
    }
   
    before( async () => {
        //Load Contracts
        tether = await Tether.new()
        rwd = await RWD. new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        //Transfer all tokens to the decentralBank
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        //Transfer 100 moch Tethers to Customers
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Moch Tether Deployment', async () => {
        it('maches names sucessfully', async () => {
            const name = await tether.name()
            assertEqual(name, 'Mock Tether Token')
        })
    })

    describe('Reward Token Deployment', async () => {
        it('maches names sucessfully', async () => {
            const name = await rwd.name()
            assertEqual(name, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('maches names sucessfully', async () => {
            const name = await decentralBank.name()
            assertEqual(name, 'Decentral Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assertEqual(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async () => {
        it('rewards token for staking', async () => {
            let result

            //Check investor balance
            result = await tether.balanceOf(customer)
            assertEqual(result.toString(), tokens('100'), 'customer mock tether balance before staking')

            await tether.approve(decentralBank.address, tokens('100'), {from:customer})
            await decentralBank.depositTokens(tokens('100'), {from:customer})

            //Check updated balance of customer
            result = await tether.balanceOf(customer)
            assertEqual(result.toString(), tokens('0'), 'customer wallet is empty')

            //Check if decentralBank has 100
            result = await tether.balanceOf(decentralBank.address)
            assertEqual(result.toString(), tokens('100'), 'money is in decentral bank')

            //Is staking balance
            result = await decentralBank.isStaking(customer)
            assertEqual(result.toString(), 'true', 'customer is staking status after staking')

            //Issue tokens
            await decentralBank.issueTokens({from:owner})

            //Ensure Only The Owner can issue tokens
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            //Unstake the tokens and check unstaking balances
            await decentralBank.unstakeTokens({from:customer})

            //Check unstaking balances
            result = await tether.balanceOf(customer)
            assertEqual(result.toString(), tokens('100'), 'there are wrong amount of coins in the customer balance')

            result = await tether.balanceOf(decentralBank.address)
            assertEqual(result.toString(), tokens('0'), 'money is out from decentral bank')

            result = await decentralBank.isStaking(customer)
            assertEqual(result.toString(), 'false', 'customer is no longer staking after unstaking')


        })
    })
})