import { combine } from "./utils";
import { getStore } from '@netlify/blobs';

export default async(request,context) => {

    const currentTime = new Date().getTime();
    console.log(`Current time: ${currentTime}`);

    //Use this to force an update to Blob
    
    // const currentTime = 1717064413659 + 61*60*1000;

    const combinedStore = getStore("ethereum");
    
    const storedData = await combinedStore.get("data",{type: "json"});
    const storedTimestamp = await combinedStore.get("timestamp", {type:"json"});
    console.log(`Stored timestamp: ${storedTimestamp}`);

    const CACHE_DURATION = 60*60*1000; //1 hour

    if (storedData && storedTimestamp && currentTime-storedTimestamp < CACHE_DURATION){
        console.log("Taking data from Blob");
        console.log(`Cache valid for another: ${((CACHE_DURATION - (currentTime - storedTimestamp)) / 1000 / 60).toFixed(2)} minutes`);
        const processed = {
            data : storedData,
            timestamp : storedTimestamp,
        };
        return new Response(JSON.stringify(processed,null,2), {
            headers: { 'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTION",
            }
        }); 
    } else{

        try{
            console.log("fetching data from blockchain...")
            const [fetch_deployments, fetch_titleCreated] = await Promise.all([
                // fetch('http://localhost:8888/.netlify/functions/sepolia-listen_deployer'),
                // fetch('http://localhost:8888/.netlify/functions/sepolia-listen_titleEscrow')
                fetch ('https://tradetrust-app.netlify.app/.netlify/functions/eth-listen_deployer'),
                fetch ('https://tradetrust-app.netlify.app/.netlify/functions/eth-listen_titleEscrow')
            ]);
            if (!fetch_deployments.ok || !fetch_titleCreated.ok){
                throw new Error ("Error fetching in combine");
            }
            console.log('fetches successful');

            const deployments = await fetch_deployments.json();
            const titleCreated = await fetch_titleCreated.json();
            
            function bigintReplacer(key, value) {
                return typeof value === 'bigint' ? value.toString() : value;
            }
            console.log(deployments);
            const input_deployments = JSON.stringify(deployments,bigintReplacer,2);
            const input_titleCreated = JSON.stringify(titleCreated,bigintReplacer,2);
            
            console.log('combining...')
            const combined = combine(input_deployments,input_titleCreated);
            const newTimestamp = currentTime;
            

            await combinedStore.setJSON("data",combined);
            await combinedStore.set("timestamp",newTimestamp);
            // console.log('processed data: '+ JSON.stringify(processed.data,null,2));
            console.log('data set to Blob');


            const processed = {
                data : combined,
                timestamp : newTimestamp
            };
            
            const jsonString = JSON.stringify(processed, bigintReplacer, 2);
            return new Response(jsonString, {
                headers: { 'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTION",
                }
            }); 
        }   catch(error){
            console.log(error);
            return new Response(JSON.stringify({ error: 'Failed combining data' }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                }
            });
        };
    }
}


