import mysql from 'mysql2/promise';
import 'dotenv/config';

export default async (request, context) => {

    // const url = new URL(request.url);
    // const params = url.searchParams;
    // const address = params.get('address');
    // console.log(address);
    
    // const chainId = params.get('chainId');
    // console.log(chainId);
    try {
        console.log('connecting to db');
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DATABASE
        });
        console.log('connected');

        // Query the deployments table
        const [rows] = await connection.query(`select * from networks`);
        console.log('fetched');

        await connection.end();
        console.log('ended');

        // Return the fetched data
        return new Response (JSON.stringify(rows), {
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
