// const {Web3}  = require('web3');
import Web3 from 'web3';
import { processEventsTitleEscrow } from './utils';

const url = "https://tradetrustrpc.xdcrpc.com"  // url string

const web3 = new Web3(new Web3.providers.HttpProvider(url));
const titleEscrowFactory = "0x50BfCc1b699fD2308B978B7a6A26e3C3Bbad16DC"
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
    
        // const events = await contract.getPastEvents('TitleEscrowCreated',{
        //     fromBlock: 60849025, //same block as deployer because as of creation of deployer, factory no events
        //     toBlock: 63849025, 
        // });

        const startBlock = 60849025;
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

        // while (currentBlock <= endBlock) {
        //     const fromBlock = currentBlock;
        //     console.log('fromblock', fromBlock);
        //     const toBlock = Math.min(currentBlock + batchSize - 1, endBlock);

        //     const events = await contract.getPastEvents('TitleEscrowCreated', {
        //         fromBlock: fromBlock,
        //         toBlock: toBlock,
        //     });

        //     allEvents = allEvents.concat(events);
        //     currentBlock += batchSize;
        // }

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