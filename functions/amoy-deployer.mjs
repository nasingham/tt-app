// const {Web3}  = require('web3');
import Web3 from 'web3';
import { processEventsDeployer } from './utils';


const web3 = new Web3("https://polygon-amoy.infura.io/v3/48bea089ceb34f579d2381195ca46c1d");


const deployer = "0x274eF26b068C0E100cD3A9bf39998CAe336c8e1f"
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
    
        const events = await contract.getPastEvents('Deployment',{
            fromBlock: 8177515, //creation block for amoy deployer
            toBlock: 'latest',
        });
        
        const processed =  processEventsDeployer(events);

        console.log({process:processed});
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