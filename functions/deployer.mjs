// const {Web3}  = require('web3');
import Web3 from 'web3';
import { processEventsDeployer } from './utils.js';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import { chainInfo } from './utils.js';



// const web3 = new Web3(`https://polygon-amoy.infura.io/v3/${process.env.INFURA_KEY}`);
// const deployer = "0x274eF26b068C0E100cD3A9bf39998CAe336c8e1f"
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

function bigintReplacer(key, value) {
    return typeof value === 'bigint' ? value.toString() : value;
}


export const handler = async (event) => {
    try {
        const response = [];
        for (const chainId in chainInfo) {
            if (Object.prototype.hasOwnProperty.call(chainInfo, chainId)) {
                console.log(`fetching deployment ${chainId}`);

                const chain = chainInfo[chainId];
                const rpcUrl = chain.rpcUrl;
                const web3 = new Web3(rpcUrl);
                const deployer = chain.deployer;
                await web3.eth.net.isListening();
                console.log('deployer listening');


                console.log('connecting to db');
                // Insert the processed data into the MySQL database
                const connection = await mysql.createConnection({
                    host: process.env.RDS_HOSTNAME,
                    user: process.env.RDS_USERNAME,
                    password: process.env.RDS_PASSWORD,
                    database: process.env.RDS_DATABASE
                });
                console.log('connected to db');


                // const chainId = 80002; //amoy networkID
                const contract = new web3.eth.Contract(contractABI, deployer);

                

                // const startBlock = 8177515; //creation block for amoy deployer
                const [rows] = await connection.query(`SELECT MAX(deploymentBlockNumber) as latestBlock from deployments where chainId = ${chainId}`);
                const startBlock = rows[0].latestBlock;
                console.log('startblock', startBlock);
                const endBlock = Number(await web3.eth.getBlockNumber());
                console.log('endBlock',endBlock);
                const batchSize = 500000; // Adjust this size based on your needs
                let allEvents = [];

                const getBatchEvents = async (fromBlock, toBlock) => {
                    // console.log('fromblock ', fromBlock);
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

                // const events = await contract.getPastEvents('Deployment',{
                //     fromBlock: startBlock,
                //     toBlock: 'latest',
                // })
                if (allEvents.length){
                    const processed = processEventsDeployer(allEvents);

            
                    // const deleteQuery = 'DELETE FROM deployments where networkId';
                    console.log('inserting into db');
                    const insertQuery = 'INSERT IGNORE INTO deployments (txnHash, chainId, deploymentBlockNumber, walletAddress, titleEscrowFactory, implementation, tokenRegistry) VALUES ?';
                    const values = processed.deployments.map(event => [
                        event.txnHash,
                        chainId,
                        event.deploymentBlockNumber,
                        event.walletAddress,
                        event.titleEscrowFactory,
                        event.implementation,
                        event.tokenRegistry
                    ]);
                    response.push(values);
            
                    // await connection.query(deleteQuery);
                    // console.log('deleted');
                    await connection.query(insertQuery, [values]);
                    console.log('inserted');
                    await connection.end();
                    console.log('ended');
                }
            }
        }

        // const response = JSON.stringify(processed, bigintReplacer, 2);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTION'
            },
            body: JSON.stringify(response , bigintReplacer, 2),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Failed deployer fetching data' })
        };
    }
};


