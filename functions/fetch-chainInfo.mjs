// import mysql from 'mysql2/promise';
import 'dotenv/config';
import { ChainId, networkType, chainInfo } from './utils';

export default async (request, context) => {

    const url = new URL(request.url);
    const params = url.searchParams;
    const chainId = params.get('chainId');
    try {

        console.log('ended', chainInfo[chainId]);
        const result = chainInfo[chainId];

        // Return the fetched data
        return new Response (JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTION'
            },
        });
            
    } catch (error) {
      console.error('Error fetching data:', error);
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
};
