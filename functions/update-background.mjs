import { combine } from "./utils.js";
import { getStore } from '@netlify/blobs';
import zlib from 'node:zlib';

export default async(request,context) => {


    const url = new URL(request.url);
    const params = url.searchParams;
    const storeName = params.get('storeName');


    const currentTime = new Date().getTime();

    const combinedStore = getStore(storeName);

    await combinedStore.delete("data");
    await combinedStore.delete("timestamp");
    console.log('deleted');

    try{
        console.log("fetching data from blockchain...")
        // const [fetch_deployments, fetch_titleCreated] = await Promise.all([
        //     fetch('http://localhost:9999/.netlify/functions/sepolia-listen_deployer'),
        //     fetch('http://localhost:9999/.netlify/functions/sepolia-listen_titleEscrow')
        //     // fetch ('https://tradetrust-app.netlify.app/.netlify/functions/sepolia-listen_deployer'),
        //     // fetch ('https://tradetrust-app.netlify.app/.netlify/functions/sepolia-listen_titleEscrow')
        // ]);

        
        // const fetch_deployments = await fetch(`http://localhost:8888/.netlify/functions/${storeName}-deployer`);
        // const fetch_titleCreated = await fetch(`http://localhost:8888/.netlify/functions/${storeName}-titleEscrow`);
        const fetch_deployments = await fetch(`https://tradetrust-scan.netlify.app/.netlify/functions/${storeName}-deployer`);
        const fetch_titleCreated = await fetch(`https://tradetrust-scan.netlify.app/.netlify/functions/${storeName}-titleEscrow`);
        if (!fetch_deployments.ok || !fetch_titleCreated.ok){
            throw new Error ("Error fetching in combine");
        }
        console.log('fetches successful');
        // console.log({fetch_title:fetch_titleCreated});
        const deployments = await fetch_deployments.json();
        const titleCreated = await fetch_titleCreated.json();
        
        function bigintReplacer(key, value) {
            return typeof value === 'bigint' ? value.toString() : value;
        }

        const input_deployments = JSON.stringify(deployments,bigintReplacer,2);
        const input_titleCreated = JSON.stringify(titleCreated,bigintReplacer,2);
        
        console.log('combining...')
        const combined = combine(input_deployments,input_titleCreated);
        const newTimestamp = currentTime;

        for (const [key,value] of Object.entries(combined.deployments)){
            await combinedStore.setJSON(key,value);
        }
        

        // await combinedStore.setJSON("data",combined);
        await combinedStore.set("blobTimestamp",newTimestamp);


        // console.log('processed data: '+ JSON.stringify(processed.data,null,2));
        console.log('data set to Blob');
        console.log(await combinedStore.list());
    }   catch(error){
        console.log(error);
       
    };
}