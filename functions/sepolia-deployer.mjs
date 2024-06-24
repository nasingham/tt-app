// const Web3 = require('web3');
// const mysql = require('mysql2/promise');
// require('dotenv').config();

import Web3 from 'web3';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import { processEventsDeployer } from './utils.js';


const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/oYTceCr2171uweAFpcDci_A-434gf1Qj');
const deployer = "0x9eBC30E7506E6Ce36eAc5507FCF0121BaF7AeA57"

// ABI of Deployer
const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "_logic", "type": "address" },
            { "internalType": "bytes", "name": "_data", "type": "bytes" }
        ],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "address", "name": "previousAdmin", "type": "address" },
            { "indexed": false, "internalType": "address", "name": "newAdmin", "type": "address" }
        ],
        "name": "AdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "beacon", "type": "address" }
        ],
        "name": "BeaconUpgraded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }
        ],
        "name": "Upgraded",
        "type": "event"
    },
    { "stateMutability": "payable", "type": "fallback" },
    { "stateMutability": "payable", "type": "receive" },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "deployed", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "implementation", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "deployer", "type": "address" },
            { "indexed": false, "internalType": "address", "name": "titleEscrowFactory", "type": "address" },
            { "indexed": false, "internalType": "bytes", "name": "params", "type": "bytes" }
        ],
        "name": "Deployment",
        "type": "event"
    }
];

export const handler = async (event) => {
    try {
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


        const chainId = 11155111; //sepolia networkID
        const contract = new web3.eth.Contract(contractABI, deployer);

        function bigintReplacer(key, value) {
            return typeof value === 'bigint' ? value.toString() : value;
        }

        // const startBlock = 1846504; // sepolia Deployer creation block
        const [rows] = await connection.query(`SELECT MAX(deploymentBlockNumber) as latestBlock from deployments where chainId = ${chainId}`);
        const startBlock = rows[0].latestBlock;
        console.log('startblock', startBlock);
        // const endBlock = Number(await web3.eth.getBlockNumber());
        // const batchSize = 500000; // Adjust this size based on your needs
        // let allEvents = [];

        // const getBatchEvents = async (fromBlock, toBlock) => {
        //     console.log('fromblock ', fromBlock);
        //     return await contract.getPastEvents('Deployment', {
        //         fromBlock: fromBlock,
        //         toBlock: toBlock,
        //     });
        // };

        // const promises = [];
        // for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock += batchSize) {
        //     const fromBlock = currentBlock;
        //     const toBlock = Math.min(currentBlock + batchSize - 1, endBlock);
        //     promises.push(getBatchEvents(fromBlock, toBlock));
        // }

        // const results = await Promise.all(promises);
        // results.forEach(events => {
        //     allEvents = allEvents.concat(events);
        // });

        const events = await contract.getPastEvents('Deployment',{
            fromBlock: startBlock,
            toBlock: 'latest',
        })
        const processed = processEventsDeployer(events);

        
        // const deleteQuery = 'DELETE FROM deployments where networkId';
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
        
        // await connection.query(deleteQuery);
        // console.log('deleted');
        await connection.query(insertQuery, [values]);
        console.log('inserted');
        await connection.end();
        console.log('ended');

        const response = JSON.stringify(processed, bigintReplacer, 2);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTION'
            },
            body: response
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
