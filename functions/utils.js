// utils.js
import Web3 from 'web3';
const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/oYTceCr2171uweAFpcDci_A-434gf1Qj');

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
    let timestamp;

    events.forEach(event => {
        if (event.event === 'Deployment') {
            numDeployments++;
            deploymentBlockNumber = event.blockNumber;
            timestamp = web3.eth.getBlock(deploymentBlockNumber).timestamp;
            txnHash = event.transactionHash;
            implementation = event.returnValues.implementation;
            const deployer = event.returnValues.deployer;
            const deployed = event.returnValues.deployed;
            const titleEscrowFactory = event.returnValues.titleEscrowFactory;
            returnValues.push({ txnHash, deploymentBlockNumber, timestamp, deployer, titleEscrowFactory, deployed  });
            if (!uniqueDeployer.has(deployer)){
                uniqueDeployer.add(deployer);
            }
            if (!uniqueFactory.has(titleEscrowFactory)){
                uniqueFactory.add(titleEscrowFactory);
            }
            if (!uniqueDeployed.has(deployed)){
                uniqueDeployed.add(deployed);
            }
            if (!uniqueImplementation.has(implementation)){
                uniqueImplementation.add(implementation);
            }
            
        }
    });

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
    let numCreated = 0;
    const uniqueTokenRegistry = new Set();
    const returnValues = [];
    let titleBlockNumber;
    let timestamp;
    let txnHash;

    events.forEach(event => {
        if (event.event === 'TitleEscrowCreated'){
            numCreated++;
            titleBlockNumber = event.blockNumber;
            timestamp = web3.eth.getBlock(titleBlockNumber).timestamp;
            txnHash = event.transactionHash;
            const tokenRegistry = event.returnValues.tokenRegistry
            const tokenId = event.returnValues.tokenId;
            const titleEscrow = event.returnValues.titleEscrow;
            returnValues.push({txnHash,blockNumber, timestamp, tokenRegistry, tokenId, titleEscrow });

            uniqueTokenRegistry.add(tokenRegistry);
        }
    });

    return {
        numCreated,
        returnValues,
    };
}

export  function combine(string_deployments, string_titleCreated){
    // console.log('Type of deployments:', typeof string_deployments);
    // console.log('Type of titleCreated:', typeof string_titleCreated);
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
            const contents = new Set();
            // deployment.deployed = [deployed, {'number of tokens':0},[]];
            
            
            // deployment.deployed = deployment;
            titleCreated.returnValues.forEach(creation => {
                const txnHash = creation.txnHash;
                const tokenReg = creation.tokenRegistry;
                const tokenId = creation.tokenId;
                const titleEscrow = creation.titleEscrow;
                const blockNumber = creation.blockNumber;
                const timestamp = creation.timestamp;
                const content = {txnHash,tokenId,titleEscrow,blockNumber,timestamp};
                if (deployed === tokenReg){
                    contents.push(content);
                }
                
            })
            const num_tokens = contents.size;
            const deployment_info = {deployed,num_tokens,contents}
            deployments.deployed = deployment_info;
            
        });
        deployments.numCreated = titleCreated.numCreated;

        

    return {
        deployments,
    }
}
