// const {Web3}  = require('web3');
import Web3 from 'web3';
import { processEventsTitleEscrow } from './utils.js';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import { chainInfo } from './utils.js';

//ABI of TitleEscrowFactory
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

function bigintReplacer(key, value) {
    return typeof value === 'bigint' ? value.toString() : value;
}


export const handler = async (event) => {
    try {
        const response = [];
        for (const chainId in chainInfo) {
            if (Object.prototype.hasOwnProperty.call(chainInfo, chainId)) {
                console.log(`fetching titles ${chainId}`);

                const chain = chainInfo[chainId];
                const rpcUrl = chain.rpcUrl;
                const web3 = new Web3(rpcUrl);
                const titleEscrowFactory = chain.titleEscrowFactory;
                await web3.eth.net.isListening();
                console.log('listening in titles');


                console.log('connecting to db');
                // Insert the processed data into the MySQL database
                const connection = await mysql.createConnection({
                    host: process.env.RDS_HOSTNAME,
                    user: process.env.RDS_USERNAME,
                    password: process.env.RDS_PASSWORD,
                    database: process.env.RDS_DATABASE
                });
                console.log('connected to db');

                const contract = new web3.eth.Contract(contractABI, titleEscrowFactory);

                

                
                const [rows] = await connection.query(`SELECT MAX(titleBlockNumber) as latestBlock from titleEscrowsCreated where chainId = ${chainId}`);
                const startBlock = rows[0].latestBlock;
                console.log('startblock', startBlock);
                const endBlock = Number(await web3.eth.getBlockNumber());
                console.log('endBlock',endBlock);
                const batchSize = 500000; // Adjust this size based on your needs
                let allEvents = [];

                const getBatchEvents = async (fromBlock, toBlock) => {
                    // console.log('fromblock ', fromBlock);
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

                // const events = await contract.getPastEvents('TitleEscrowCreated',{
                //     fromBlock: startBlock,
                //     toBlock: 'latest',
                // })
                if (allEvents.length){
                    const processed = processEventsTitleEscrow(allEvents);

            
                    
                    console.log('inserting into db');
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
            body: JSON.stringify({ error: 'Failed titles fetching data' })
        };
    }
};


