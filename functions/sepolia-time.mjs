// import { getStore } from '@netlify/blobs';
// import { getTime } from "./utils";
// import Web3 from 'web3';

// const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/oYTceCr2171uweAFpcDci_A-434gf1Qj');

// export default async(request,context)=> {
//     // Create a new store to store the data with timestamps
//     const newData = [];
//     const timeStore = getStore("sepolia-time");
//     const combinedStore = getStore("sepolia");
    
//     const storedData = await combinedStore.get("data",{type: "json"});
//     if (storedData){
//     // Iterate through each item in storedData and fetch the timestamp
//         for (const deployment of storedData.deployments.returnValues) {
//             const deployedTimestamp = await getTime(deployment.deploymentBlockNumber, web3);
//             if (deployedTimestamp !== null) {
//                 // Create a new object with the timestamp appended
//                 const newDataItem = { ...deployment, deployedTimestamp };

//                 // Append timestamp to each item in the contents array
//                 if (newDataItem.deployed.contents && newDataItem.deployed.contents.length > 0) {
//                     newDataItem.deployed.contents.forEach(async (content) => {
//                         const titleTimestamp = await getTime(content.titleBlockNumber, web3);
//                         if (titleTimestamp !== null) {
//                             content.titleTimestamp = titleTimestamp;
//                         }
//                     });
//                 }

//                 // Push the new object to newData
//                 newData.push(newDataItem);
//             }
//         }
//     }

//     await timeStore.setJSON("data",newData);
//     console.log('sepolia-time set to store');

//     // After all asynchronous operations are completed, return newData
//     return new Response(newData, {
//         headers: { 'Content-Type': 'application/json',
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers": "Content-Type",
//             "Access-Control-Allow-Methods": "GET, POST, OPTION",
//             }
//     });
// }




