// const Web3 = require('web3');
// const mysql = require('mysql2/promise');
// require('dotenv').config();

import Web3 from 'web3';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import {processEventsTitleEscrow } from './utils.js';


const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/oYTceCr2171uweAFpcDci_A-434gf1Qj');
const titleEscrowFactory = "0x5aA71Cc9559bC5e54E9504a81496d9F8454721F5"

// ABI of Deployer
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
  ];

export const handler = async (event) => {
    try {
        await web3.eth.net.isListening();
        console.log('title listening');

        console.log('connecting to db');
        // Insert the processed data into the MySQL database
        const connection = await mysql.createConnection({
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DATABASE
        });
        console.log('connected');


        const chainId = 11155111; //sepolia networkID
        const contract = new web3.eth.Contract(contractABI, titleEscrowFactory);

        function bigintReplacer(key, value) {
            return typeof value === 'bigint' ? value.toString() : value;
        }

        // const startBlock = 2428240; //sepolia Title creation block
        const [rows] = await connection.query(`SELECT MAX(titleBlockNumber) as latestBlock from titleEscrowsCreated where chainId = ${chainId}`);
        const startBlock = rows[0].latestBlock;
        console.log('startblock', startBlock);

        // const endBlock = Number(await web3.eth.getBlockNumber());
        // const batchSize = 500000; // Adjust this size based on your needs
        // let allEvents = [];

        // const getBatchEvents = async (fromBlock, toBlock) => {
        //     console.log('fromblock ', fromBlock);
        //     return await contract.getPastEvents('TitleEscrowCreated', {
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

        const events = await contract.getPastEvents('TitleEscrowCreated',{
          fromBlock: startBlock,
          toBlock: 'latest',
        })

        const processed = processEventsTitleEscrow(events);

        
        // const deleteQuery = 'DELETE FROM titleEscrowsCreated';
        const insertQuery = 'INSERT IGNORE INTO titleEscrowsCreated (txnHash, chainId, titleBlockNumber, tokenRegistry, tokenId, titleEscrow, removed) VALUES ?';
        const values = processed.titleEscrowsCreated.map(event => [
            event.txnHash,
            chainId,
            event.titleBlockNumber,
            event.tokenRegistry,
            event.tokenId,
            event.titleEscrow,
            event.removed
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
