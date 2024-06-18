// const {Web3}  = require('web3');
import Web3 from 'web3';
import { processEventsDeployer } from './utils';


const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/oYTceCr2171uweAFpcDci_A-434gf1Qj');
const deployer = "0x9eBC30E7506E6Ce36eAc5507FCF0121BaF7AeA57"
//ABI of Deployer
const contractABI = [
    {
    "inputs": [
        {
        "internalType": "address",
        "name": "_logic",
        "type": "address"
        },
        {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
        }
    ],
    "stateMutability": "payable",
    "type": "constructor"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
        },
        {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
        }
    ],
    "name": "AdminChanged",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
        }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
        }
    ],
    "name": "Upgraded",
    "type": "event"
    },
    {
    "stateMutability": "payable",
    "type": "fallback"
    },
    {
    "stateMutability": "payable",
    "type": "receive"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": true,
        "internalType": "address",
        "name": "deployed",
        "type": "address"
        },
        {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
        },
        {
        "indexed": true,
        "internalType": "address",
        "name": "deployer",
        "type": "address"
        },
        {
        "indexed": false,
        "internalType": "address",
        "name": "titleEscrowFactory",
        "type": "address"
        },
        {
        "indexed": false,
        "internalType": "bytes",
        "name": "params",
        "type": "bytes"
        }
    ],
    "name": "Deployment",
    "type": "event"
    }
]




export default async (request,context) => {
    
    try{  
        await web3.eth.net.isListening();
        console.log('deployer listening');

    
        const contract = new web3.eth.Contract(contractABI,deployer);

        function bigintReplacer(key, value) {
            return typeof value === 'bigint' ? value.toString() : value;
        }
        
        const startBlock = 1846504; //sepolia Deployer creation block
        const endBlock = Number(await web3.eth.getBlockNumber());
        const batchSize = 500000; // Adjust this size based on your needs
        // let currentBlock = startBlock;
        let allEvents = [];

        const getBatchEvents = async (fromBlock, toBlock) => {
          console.log('fromblock ',fromBlock);
          return await contract.getPastEvents('Deployment', {
              fromBlock: fromBlock,
              toBlock: toBlock,
          });
        };

        const promises = [];
        for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock += batchSize) {
            const fromBlock = currentBlock;
            const toBlock = Math.min(currentBlock + batchSize - 1, endBlock);
            promises.push(getBatchEvents(fromBlock, toBlock));
        }

        const results = await Promise.all(promises);
        results.forEach(events => {
            allEvents = allEvents.concat(events);
        });
        
        const processed =  processEventsDeployer(allEvents);

        // console.log({process:processed});
        const response = JSON.stringify(processed, bigintReplacer,2);
        return new Response(response, {
            headers: { 'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTION",
            }
        })
        
    } catch(error){
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed deployer fetching data' }), { headers: { 'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*" } });
      };
}   