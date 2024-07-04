// import mysql from 'mysql2/promise';
import 'dotenv/config';

export default async (request, context) => {

    const url = new URL(request.url);
    const params = url.searchParams;
    const chainId = params.get('chainId');
    try {
        const ChainId = {
            ethereum : 1,
            sepolia : 11155111,
            polygon : 137,
            amoy : 80002,
            gtn : 101010,
            stabilityTestnet : 20180427,
            xdc : 50,
            apothem : 51
        }

        const  networkType = {
            mainnet : 'mainnet',
            testnet : 'testnet'
        }

        const chainInfo = {
            [ChainId.ethereum]: {
                label : 'eth',
                chainId: ChainId.ethereum,
                networkName : 'ethereum',
                networkType : networkType.mainnet,
                rpcUrl : `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
                explorerUrl : "https://etherscan.io/address/",
                deployer : "0x92470d0Fc33Cbf2f04B39696733806a15eD7eef3",
                titleEscrowFactory : "0xA38CC56c9291B9C1f52F862dd92326d352e710b8",
            },
            [ChainId.sepolia]:{
                label: 'sepolia',
                chainId : ChainId.sepolia,
                networkName : 'sepolia',
                networkType : networkType.testnet,
                rpcUrl : `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
                explorerUrl : "https://sepolia.etherscan.io/address/",
                deployer : "0x9eBC30E7506E6Ce36eAc5507FCF0121BaF7AeA57",
                titleEscrowFactory : "0x5aA71Cc9559bC5e54E9504a81496d9F8454721F5",
            },
            [ChainId.polygon]: {
                label: 'polygon',
                chainId : ChainId.polygon,
                networkName: 'polygon',
                networkType: networkType.mainnet,
                rpcUrl : `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
                explorerUrl : "https://polygonscan.com/address/",
                deployer : "0x92470d0Fc33Cbf2f04B39696733806a15eD7eef3",
                titleEscrowFactory : "0x5B5F8d94782be18E22420f3276D5ef5a1bc65C53",
            },
            [ChainId.amoy]: {
                label: 'amoy',
                chainId : ChainId.amoy,
                networkName : 'amoy',
                networkType : networkType.testnet,
                rpcUrl : `https://polygon-amoy.infura.io/v3/${process.env.INFURA_KEY}`,
                explorerUrl : "https://amoy.polygonscan.com/address/",
                deployer : "0x274eF26b068C0E100cD3A9bf39998CAe336c8e1f",
                titleEscrowFactory : "0x812A0E71c61A42C8d3d449BdfF51834f85686C73",
            },
            [ChainId.gtn]: {
                label : 'gtn',
                chainId : ChainId.gtn,
                networkName: 'gtn',
                networkType: networkType.mainnet,
                rpcUrl : `https://gtn.stabilityprotocol.com/zgt/${process.env.GTN_KEY}`,
                explorerUrl : "https://stability.blockscout.com/address/",
                deployer : "0x163A63415d1bf6DeE66B0624e2313fB9127a599b",
                titleEscrowFactory : "0x5B5F8d94782be18E22420f3276D5ef5a1bc65C53",
            },
            [ChainId.stabilityTestnet] : {
                label: 'stabilityTestnet',
                chainId : ChainId.stabilityTestnet,
                networkName: 'stabilityTestnet',
                networkType: networkType.testnet,
                rpcUrl : `https://free.testnet.stabilityprotocol.com/zgt/${process.env.STABILITY_TEST_KEY}`,
                explorerUrl : "https://stability-testnet.blockscout.com/address/",
                deployer : "0xc9A4F6b4f7afAeC816f2CFB715bB92384Fa46BCa",
                titleEscrowFactory : "0xd334a95bbA0b666981fD067A5Edd505aFB6cFa1d",
            },
            [ChainId.xdc] : {
                label: 'xdc',
                chainId : ChainId.xdc,
                networkName: 'xdc',
                networkType : networkType.mainnet,
                rpcUrl : "https://tradetrustrpc.xdcrpc.com",
                explorerUrl : "https://xdc.blocksscan.io/address/",
                deployer : "0xF69B8542a1015c8af590c3aF833A225094aAB57C",
                titleEscrowFactory : "0x50BfCc1b699fD2308B978B7a6A26e3C3Bbad16DC",
            },
            [ChainId.apothem] : {
                label: 'apothem',
                chainId : ChainId.apothem,
                networkName : 'xdc-apothem',
                networkType : networkType.testnet,
                rpcUrl : `https://polygon-amoy.infura.io/v3/${process.env.INFURA_KEY}`,
                explorerUrl : "https://apothem.blocksscan.io/address/",
                deployer : "0x274eF26b068C0E100cD3A9bf39998CAe336c8e1f",
                titleEscrowFactory : "0x812A0E71c61A42C8d3d449BdfF51834f85686C73",
            }
        }

        // const result = Object.keys(chainInfo).get(chainId);

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
