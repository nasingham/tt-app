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
    const deployments = [];

    for (const event of events) {
        if (event.event === 'Deployment') {
            const deploymentBlockNumber = event.blockNumber;
            // let deployTimestampObject = await getTime(deploymentBlockNumber,web3);
            // deployTimestamp = deployTimestampObject.timestamp;
            const txnHash = event.transactionHash;
            const implementation = event.returnValues.implementation;
            const walletAddress = event.returnValues.deployer;
            const tokenRegistry = event.returnValues.deployed;
            const titleEscrowFactory = event.returnValues.titleEscrowFactory;
            deployments.push({ txnHash, deploymentBlockNumber, walletAddress, titleEscrowFactory, implementation, tokenRegistry  });           
            
        }
    };

    return {
        deployments,
        
    };
}

export function processEventsTitleEscrow(events){
    const titleEscrowsCreated = [];

    for (const event of events) {
        if (event.event === 'TitleEscrowCreated'){
  
            const titleBlockNumber = event.blockNumber;
            const txnHash = event.transactionHash;
            const tokenRegistry = event.returnValues.tokenRegistry
            const tokenId = event.returnValues.tokenId;
            const titleEscrow = event.returnValues.titleEscrow;
            const removed = event.removed;
            titleEscrowsCreated.push({txnHash,titleBlockNumber, tokenRegistry, tokenId, titleEscrow, removed });
        }
    };

    return {
        titleEscrowsCreated,
    };
}

export  function combine(string_deployments, string_titleCreated){
    // console.log('Type of deployments:', typeof string_deployments);
    console.log('Type of titleCreated:', typeof string_titleCreated);
    let deployments, titleCreated;
    const standaloneMap = new Map();
    const uniqueStandalone = new Set();

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
    // console.log(deployments.returnValues);
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
                } else{
                    uniqueStandalone.add(tokenReg);
                    if (!standaloneMap.has(tokenReg)) {
                        standaloneMap.set(tokenReg, []);
                    }
                    standaloneMap.get(tokenReg).push(content);
                    
                    
                }

                
            });
            const num_tokens = contents.length;
            const deployed_info = {deployed,num_tokens,contents}
            deployment.deployed = deployed_info;
            
        });
        deployments.numCreated = titleCreated.numCreated;
        
        deployments.uniqueStandalone = Array.from(uniqueStandalone);
        const standalone = Array.from(standaloneMap.entries()).map(([tokenReg, contents]) => ({
            tokenReg,
            num_tokens: contents.length,
            contents
        }));
        deployments.standalone = standalone;

        

    return {
        deployments,
    }
}
