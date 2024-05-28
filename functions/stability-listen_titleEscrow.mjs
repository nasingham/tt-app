// const {Web3}  = require('web3');
import Web3 from 'web3';
import { processEventsTitleEscrow } from './utils';

const web3 = new Web3('https://stability-testnet.blockscout.com/api');
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
        console.log('listening');

    
        const contract = new web3.eth.Contract(contractABI,titleEscrowFactory);

        function bigintReplacer(key, value) {
            return typeof value === 'bigint' ? value.toString() : value;
        }
    
    const events = await contract.getPastEvents('TitleEscrowCreated',{
        fromBlock: 0,
        toBlock: 'latest',
    });

    const processed = processEventsTitleEscrow(events);
    const jsonString = JSON.stringify(processed, bigintReplacer, 2);
    return new Response(jsonString, {
        headers: { 'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
        }
    })
        
    } catch(error){
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed fetching data' }), { headers: { 'Content-Type': 'application/json' } });
      };
}   