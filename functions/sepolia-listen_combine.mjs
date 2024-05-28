import { combine } from "./utils"

export default async(request,context) => {
    try{
        const fetch_deployments = await fetch('http://localhost:8888/.netlify/functions/sepolia-listen_deployer');
        const fetch_titleCreated = await fetch('http://localhost:8888/.netlify/functions/sepolia-listen_titleEscrow');
        if (!fetch_deployments.ok || !fetch_titleCreated.ok){
            throw new Error ("Error fetching in combine");
        }
        console.log('fetches successful');

        const deployments = await fetch_deployments.json();
        const titleCreated = await fetch_titleCreated.json();
            
        console.log(deployments);
        console.log(titleCreated);
        
        function bigintReplacer(key, value) {
            return typeof value === 'bigint' ? value.toString() : value;
        }
        const input_deployments = JSON.stringify(deployments,bigintReplacer,2);
        const input_titleCreated = JSON.stringify(titleCreated,bigintReplacer,2);
        const processed = combine(input_deployments, input_titleCreated);
        console.log('processed: '+ processed);
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
        return new Response(JSON.stringify({ error: 'Failed combining data' }), { headers: { 'Content-Type': 'application/json' } });
        };
}