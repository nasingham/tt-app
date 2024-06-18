// const {Web3}  = require('web3');
import Web3 from 'web3';
import { processEventsTitleEscrow } from './utils';

const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/oYTceCr2171uweAFpcDci_A-434gf1Qj');
const titleEscrowFactory = "0x5aA71Cc9559bC5e54E9504a81496d9F8454721F5"
//ABI of Deployer
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "titleEscrow",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenRegistry",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "TitleEscrowCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "create",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenRegistry",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "implementation",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]



export default async (request,context) => {

    try{  
        await web3.eth.net.isListening();
        console.log('title listening');

    
        const contract = new web3.eth.Contract(contractABI,titleEscrowFactory);

        function bigintReplacer(key, value) {
            return typeof value === 'bigint' ? value.toString() : value;
        }

        const startBlock = 2428240; //sepolia Title creation block
        const endBlock = Number(await web3.eth.getBlockNumber());
        const batchSize = 500000; // Adjust this size based on your needs
        // let currentBlock = startBlock;
        let allEvents = [];

        const getBatchEvents = async (fromBlock, toBlock) => {
          console.log('fromblock ',fromBlock);
          return await contract.getPastEvents('TitleEscrowCreated', {
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

        const processed =  processEventsTitleEscrow(allEvents);
        const response = JSON.stringify(processed,bigintReplacer,2);
        return new Response(response, {
            headers: { 'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTION",
            }
        })
        
    } catch(error){
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed fetching title data' }), { headers: { 'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*" } });
      };
}   