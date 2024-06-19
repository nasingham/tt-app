import { getStore } from '@netlify/blobs';
import zlib from 'node:zlib';

export default async(request,context) => {

    // const currentTime = new Date().getTime();
    // console.log(`Current time: ${currentTime}`);

    //Use this to force an update to Blob
    
    // const currentTime = 1717064413659 + 61*60*1000;

    const gzipResponse = (data) => {
            return new Promise((resolve, reject) => {
              zlib.gzip(data, (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              });
            });
          };


    try{
        const combinedStore = getStore("sepolia");
        
        const storedData = await combinedStore.get("uniqueDeployer",{type: "json"});
        const storedTimestamp = await combinedStore.get("blobTimestamp", {type:"json"});
        console.log(`Stored timestamp: ${storedTimestamp}`);

        // const CACHE_DURATION = 1*60*1000; //1 hour

        // const gzipResponse = (data) => {
        //     return new Promise((resolve, reject) => {
        //       zlib.gzip(data, (error, result) => {
        //         if (error) {
        //           reject(error);
        //         } else {
        //           resolve(result);
        //         }
        //       });
        //     });
        //   };

        if (storedData && storedTimestamp){
            console.log("Taking data from Blob");
            // console.log(`Cache valid for another: ${((CACHE_DURATION - (currentTime - storedTimestamp)) / 1000 / 60).toFixed(2)} minutes`);
            const processed = {
                data : storedData,
                timestamp : storedTimestamp,
            };
            const response = JSON.stringify(processed, null, 2);

            const compressedResponse = await gzipResponse(response);

            return new Response(compressedResponse, {
                headers: { 
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTION",
                }
            }); 
        }else{
            console.log('No data found in Blob')
            return new Response(JSON.stringify({ error: 'No data found' }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTION',
                },
                status: 404
            });
        }
    }catch (error) {
        console.error('Error fetching data from Blob:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            status: 500
        });
    }
}