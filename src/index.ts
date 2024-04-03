import * as algokit from '@algorandfoundation/algokit-utils';

async function main() {

    // Create a default localnet client, not mainnet, not testnet
    const algorand = algokit.AlgorandClient.defaultLocalNet()

    // Create two accounts
    const Destinne = algorand.account.random()
    const Maria = algorand.account.random()

    // Log the Addresses
    console.log("Account Maria: ", Destinne.addr)
    console.log("Account Destinne: ", Maria.addr)

    // Get Account Information
    console.log("Destinne's Account: ", await algorand.account.getInformation(Destinne.addr))
    console.log("Maria's Account: ", await algorand.account.getInformation(Maria.addr))

    // Fund both Accounts
    const dispenser = await algorand.account.dispenser()

    // For Destinne
    await algorand.send.payment({
        sender: dispenser.addr,
        receiver: Destinne.addr,
        amount: algokit.algos(10)
    })

    // For Maria
    await algorand.send.payment({
        sender: dispenser.addr,
        receiver: Maria.addr,
        amount: algokit.algos(10)
    })

    // View Accounts
    console.log("Destinne's Account After Funding: ", await algorand.account.getInformation(Destinne.addr), '\n')
    console.log("Maria's Account After Funding: ", await algorand.account.getInformation(Maria.addr), '\n')

    // Create Family Token
    const createResult = await algorand.send.assetCreate({
        sender: Destinne.addr,
        total: 1000000n,
        unitName: "Africoin",
        assetName: "Africa Coin",
    })

    // Result output
    console.log("Creation result: ", createResult)

    // Wait for Confirmation on AssetId
    const assetId = BigInt(createResult.confirmation.assetIndex!)
    
    //  Check if the transaction was confirmed correctly
    console.log('assetId', assetId)

    // Log Maria asset pre-opt in
    console.log("Maria Minimum Balance Rate pre opt in: ", await algorand.account.getInformation(Maria.addr))


    // Asset OptIn enables users to "OptIn" to the asset created initially!
    await algorand.send.assetOptIn({
        sender: Maria.addr,
        assetId
    })

    // Transfer the token/asset
    await algorand.send.assetTransfer({
        sender: Destinne.addr,
        receiver: Maria.addr,
        amount: 500n,
        assetId
    })

    console.log("Maria's Minimum Balance Rate post opt in: ", await algorand.account.getInformation(Maria.addr), "\n")
    
    console.log("Destinne's asset balance: ", await algorand.account.getAssetInformation(Destinne.addr, assetId))
    console.log("Maria's asset balance: ", await algorand.account.getAssetInformation(Maria.addr, assetId))


    // Destinne to send Maria the asset
    // Maria to send Destinne some ALGO
    console.log("Maria's Account Information Before  Sending ALGO and ASSET: ", (await algorand.account.getInformation(Maria.addr)).amount)

    // Destinne sending payment to Maria
    await algorand.send.payment({
        sender: Destinne.addr,
        receiver: Maria.addr,
        amount: algokit.algos(1)
    })

    // Accounting for Algo sent to Maria
    console.log("Maria's Account  Information after sending 1 Algos: ", (await algorand.account.getInformation(Maria.addr)).amount)

    // Transfer of asset from one Maria to Destinne
    await algorand.send.assetTransfer({
        sender: Maria.addr,
        receiver: Destinne.addr,
        amount: 50n,
        assetId
    })

    console.log("Destinne's Account Information after being sent 50n an ASA: ", (await algorand.account.getInformation(Destinne.addr)).assets)

    // Demonstration of atomic transactions Payment and Asset Transfer all in one!
    await algorand.newGroup().addPayment({
        sender: Destinne.addr,
        receiver: Maria.addr,
        amount: algokit.algos(5)
    }).addAssetTransfer({
        sender: Maria.addr,
        receiver: Destinne.addr,
        amount: 20n,
        assetId
    }).execute()

    console.log("Destinne's Account Information after being sent 100n an ASA: ", (await algorand.account.getInformation(Destinne.addr)).assets)

    // Log the accounts
    // console.log("Maria's Minimum Balance Rate post opt in: ", await algorand.account.getInformation(Maria.addr), "\n")
    // console.log("Destinne's Minimum Balance Rate post opt in: ", await algorand.account.getInformation(Destinne.addr))


    console.log("Destinne's asset balance: ", await algorand.account.getAssetInformation(Destinne.addr, assetId))
    console.log("Maria's asset balance: ", await algorand.account.getAssetInformation(Maria.addr, assetId))

}

main();