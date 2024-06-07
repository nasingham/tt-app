// utils.js
// import Web3 from 'web3';
// const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/oYTceCr2171uweAFpcDci_A-434gf1Qj');

export async function getTime(blockNumber,web3){
    let block = await web3.eth.getBlock(blockNumber);
    const timestamp = block.timestamp;

    return{
        timestamp
    }
}

export function processEventsDeployer(events) {
    let numDeployments = 0;
    const uniqueDeployer = new Set();
    const returnValues = [];
    const uniqueFactory = new Set();
    const uniqueDeployed = new Set();
    let deploymentBlockNumber;
    let implementation;
    const uniqueImplementation = new Set();
    let txnHash;

    for (const event of events) {
        if (event.event === 'Deployment') {
            numDeployments++;
            deploymentBlockNumber = event.blockNumber;
            // let deployTimestampObject = await getTime(deploymentBlockNumber,web3);
            // deployTimestamp = deployTimestampObject.timestamp;
            txnHash = event.transactionHash;
            implementation = event.returnValues.implementation;
            const deployer = event.returnValues.deployer;
            const deployed = event.returnValues.deployed;
            const titleEscrowFactory = event.returnValues.titleEscrowFactory;
            returnValues.push({ txnHash, deploymentBlockNumber, deployer, titleEscrowFactory, deployed  });
            
            uniqueDeployer.add(deployer);
            uniqueFactory.add(titleEscrowFactory);
            uniqueDeployed.add(deployed);
            uniqueImplementation.add(implementation);
            
            
        }
    };

    return {
        numDeployments,
        uniqueDeployer: Array.from(uniqueDeployer),
        uniqueFactory: Array.from(uniqueFactory),
        uniqueDeployed: Array.from(uniqueDeployed),
        uniqueImplementation,
        returnValues,
        
    };
}

export function processEventsTitleEscrow(events){
    console.log('processing title escrow');
    let numCreated=0;
    const uniqueTokenRegistry = new Set();
    const returnValues = [];
    let titleBlockNumber;
    // let titleTimestamp;
    let txnHash;

    for (const event of events) {
        if (event.event === 'TitleEscrowCreated'){
            numCreated++;
            titleBlockNumber = event.blockNumber;
            // let titleTimestampObject = await getTime(titleBlockNumber,web3);
            // titleTimestamp = titleTimestampObject.timestamp;
            txnHash = event.transactionHash;
            const tokenRegistry = event.returnValues.tokenRegistry
            const tokenId = event.returnValues.tokenId;
            const titleEscrow = event.returnValues.titleEscrow;
            returnValues.push({txnHash,titleBlockNumber, tokenRegistry, tokenId, titleEscrow });

            uniqueTokenRegistry.add(tokenRegistry);
        }
    };

    return {
        numCreated,
        returnValues,
    };
}

export  function combine(string_deployments, string_titleCreated){
    // console.log('Type of deployments:', typeof string_deployments);
    console.log('Type of titleCreated:', typeof string_titleCreated);
    let deployments, titleCreated;

    try {
        deployments = JSON.parse(string_deployments);
    } catch (error) {
        console.error('Error parsing deployments:', error);
        return { error: 'Invalid deployments data' };
    }

    try {
        titleCreated = JSON.parse(string_titleCreated);
    } catch (error) {
        console.error('Error parsing titleCreated:', error);
        return { error: 'Invalid titleCreated data' };
    }
    console.log(deployments.returnValues);
    if (!deployments.returnValues || !Array.isArray(deployments.returnValues)) {
        console.error('Invalid structure for deployments.returnValues');
        return { error: 'Invalid structure for deployments' };
    }

    if (!titleCreated.returnValues || !Array.isArray(titleCreated.returnValues)) {
        console.error('Invalid structure for titleCreated.returnValues');
        return { error: 'Invalid structure for titleCreated' };
    }
    
        deployments.returnValues.forEach(deployment => {
            const deployed = deployment.deployed;
            const contents = new Array();
            // deployment.deployed = [deployed, {'number of tokens':0},[]];
            
            
            // deployment.deployed = deployment;
            titleCreated.returnValues.forEach(creation => {
                const txnHash = creation.txnHash;
                const tokenReg = creation.tokenRegistry;
                const tokenId = creation.tokenId;
                const titleEscrow = creation.titleEscrow;
                const blockNumber = creation.titleBlockNumber;
                // const timestamp = creation.titleTimestamp;
                // const content = {txnHash,tokenId,titleEscrow,blockNumber,timestamp};
                const content = {txnHash,tokenId,titleEscrow,blockNumber};
                if (deployed === tokenReg){
                    contents.push(content);
                }
                
            })
            const num_tokens = contents.size;
            const deployed_info = {deployed,num_tokens,contents}
            deployment.deployed = deployed_info;
            
        });
        deployments.numCreated = titleCreated.numCreated;

        

    return {
        deployments,
    }
}
