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

export const  networkType = {
    mainnet : 'mainnet',
    testnet : 'testnet'
}

export const ChainId = {
    ethereum : 1,
    sepolia : 11155111,
    polygon : 137,
    amoy : 80002,
    gtn : 101010,
    stabilityTestnet : 20180427,
    xdc : 50,
    apothem : 51
}

export const chainInfo = {
    [ChainId.ethereum]: {
        label : 'eth',
        chainId: ChainId.ethereum,
        networkName : 'ethereum',
        networkType : networkType.mainnet,
        rpcUrl : `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
        explorerUrl : "https://etherscan.io/address/",
        deployer : "0x92470d0Fc33Cbf2f04B39696733806a15eD7eef3",
        titleEscrowFactory : "0xA38CC56c9291B9C1f52F862dd92326d352e710b8",
    },
    [ChainId.sepolia]:{
        label: 'sepolia',
        chainId : ChainId.sepolia,
        networkName : 'sepolia',
        networkType : networkType.testnet,
        rpcUrl : `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
        explorerUrl : "https://sepolia.etherscan.io/address/",
        deployer : "0x9eBC30E7506E6Ce36eAc5507FCF0121BaF7AeA57",
        titleEscrowFactory : "0x5aA71Cc9559bC5e54E9504a81496d9F8454721F5",
    },
    [ChainId.polygon]: {
        label: 'polygon',
        chainId : ChainId.polygon,
        networkName: 'polygon',
        networkType: networkType.mainnet,
        rpcUrl : `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
        explorerUrl : "https://polygonscan.com/address/",
        deployer : "0x92470d0Fc33Cbf2f04B39696733806a15eD7eef3",
        titleEscrowFactory : "0x5B5F8d94782be18E22420f3276D5ef5a1bc65C53",
    },
    [ChainId.amoy]: {
        label: 'amoy',
        chainId : ChainId.amoy,
        networkName : 'amoy',
        networkType : networkType.testnet,
        rpcUrl : `https://polygon-amoy.infura.io/v3/${process.env.INFURA_KEY}`,
        explorerUrl : "https://amoy.polygonscan.com/address/",
        deployer : "0x274eF26b068C0E100cD3A9bf39998CAe336c8e1f",
        titleEscrowFactory : "0x812A0E71c61A42C8d3d449BdfF51834f85686C73",
    },
    [ChainId.gtn]: {
        label : 'gtn',
        chainId : ChainId.gtn,
        networkName: 'gtn',
        networkType: networkType.mainnet,
        rpcUrl : `https://gtn.stabilityprotocol.com/zgt/${process.env.GTN_KEY}`,
        explorerUrl : "https://stability.blockscout.com/address/",
        deployer : "0x163A63415d1bf6DeE66B0624e2313fB9127a599b",
        titleEscrowFactory : "0x5B5F8d94782be18E22420f3276D5ef5a1bc65C53",
    },
    [ChainId.stabilityTestnet] : {
        label: 'stabilityTestnet',
        chainId : ChainId.stabilityTestnet,
        networkName: 'stabilityTestnet',
        networkType: networkType.testnet,
        rpcUrl : `https://free.testnet.stabilityprotocol.com/zgt/${process.env.STABILITY_TEST_KEY}`,
        explorerUrl : "https://stability-testnet.blockscout.com/address/",
        deployer : "0xc9A4F6b4f7afAeC816f2CFB715bB92384Fa46BCa",
        titleEscrowFactory : "0xd334a95bbA0b666981fD067A5Edd505aFB6cFa1d",
    },
    [ChainId.xdc] : {
        label: 'xdc',
        chainId : ChainId.xdc,
        networkName: 'xdc',
        networkType : networkType.mainnet,
        rpcUrl : "https://tradetrustrpc.xdcrpc.com",
        explorerUrl : "https://xdc.blocksscan.io/address/",
        deployer : "0xF69B8542a1015c8af590c3aF833A225094aAB57C",
        titleEscrowFactory : "0x50BfCc1b699fD2308B978B7a6A26e3C3Bbad16DC",
    },
    [ChainId.apothem] : {
        label: 'apothem',
        chainId : ChainId.apothem,
        networkName : 'xdc-apothem',
        networkType : networkType.testnet,
        rpcUrl : `https://polygon-amoy.infura.io/v3/${process.env.INFURA_KEY}`,
        explorerUrl : "https://apothem.blocksscan.io/address/",
        deployer : "0x274eF26b068C0E100cD3A9bf39998CAe336c8e1f",
        titleEscrowFactory : "0x812A0E71c61A42C8d3d449BdfF51834f85686C73",
    }
}