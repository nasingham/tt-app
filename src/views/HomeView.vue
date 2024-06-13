  <template>
    <div class="home">
      <v-card>
        <p v-if="error">Something went wrong...</p>
        <p v-if="loading">Loading...</p>
        <v-virtual-scroll v-else
          :items="result"
          :height="500"
          >
          <template v-slot:default = "{item}">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
  </template>




  <script>
  // import { ref, onMounted, computed } from 'vue';
  import gql from 'graphql-tag';
  import { useQuery } from '@vue/apollo-composable';

  // const DEPLOYMENTS_QUERY = gql`
  //   query getDeployments ($skip:Int, $limit:Int) {
  //     deployments (skip:$skip, limit:$limit) {
  //       id
  //       deployed
  //       implementation
  //       deployer
  //       titleEscrowFactory
  //     }
      
      
  //   }`
  const ADDRESS_QUERY = gql`
  query address($hash: String!) {
    address(hash: $hash) {
      transactions(first: 2) {
        edges {
          node {
            hash
            internalTransactions(first: 5) {
              edges {
                node {
                  output
                  createdContractAddressHash
                }
              }
            }
            blockNumber
            createdContractAddressHash
          }
        }
      }
    }
  }
`;


  // const TITLE_QUERY = gql`
  // query getTitleEscrowCreateds ($tokenRegistry: Bytes!) {
  //   titleEscrowCreateds (where: { tokenRegistry : $tokenRegistry}) {
  //     id
  //     titleEscrow
  //     tokenRegistry
  //     tokenId
  //     blockNumber
  //   }
  // }`
  

  export default{
    name: 'HomeView',



    data() {
      const { result, loading, error} = useQuery(ADDRESS_QUERY,{
        variables: {hash: "0x9eBC30E7506E6Ce36eAc5507FCF0121BaF7AeA57"}
      });
        
      

      return{
        result,
        loading,
        error,
        
      }
      
      // const sepoliaData = ref(null);
      // const ethData = ref(null);
      // const stabilityData = ref(null);
      // const sepoliaTimestamp = ref(null);
      // const ethTimestamp = ref(null);
      // const stabilityTimestamp = ref(null);
      // const error = ref(null);

      // const fetchData = async (url, dataRef, timestampRef) => {
      //   try {
      //     const response = await fetch(url);
      //     if (!response.ok) {
      //       throw new Error('Network response not ok');
      //     }
      //     const result = await response.json();
      //     console.log('result');
      //     console.log(result);
      //     dataRef.value = result.data;  
      //     console.log(typeof result.timestamp);
      //     timestampRef.value = (new Date((parseInt(result.timestamp)))).toLocaleString();
      //     console.log('fetch data time  ' + timestampRef.value);
      //   } catch (err) {
      //     console.log(err);
      //     error.value = err.toString();
      //   }
      // };

      // const getSepolia = () => {
      //   console.log('fetching sepolia')
      //     fetchData(
      //         'https://tradetrust-app.netlify.app/.netlify/functions/sepolia-listen_combine',
      //         sepoliaData,
      //         sepoliaTimestamp
      //       );
      //   console.log(sepoliaTimestamp);
      // };
        

      // const getEth = () => {
      //   console.log('fetching eth')
      //     fetchData(
      //       'https://tradetrust-app.netlify.app/.netlify/functions/eth-listen_combine',
      //       ethData,
      //       ethTimestamp
      //     );
      // };

      // const getStability = () => {
      //   console.log('fetching stability')
      //     fetchData(
      //       'https://tradetrust-app.netlify.app/.netlify/functions/stability-listen_combine',
      //       stabilityData,
      //       stabilityTimestamp
      //     );
      //   };


      // onMounted(() => {
      //   console.log('mounted');
      //   getSepolia(); // Load the default tab's data
      //   getStability();
      //   getEth();
      // });

      // const totalDeployments = computed(()=>{
      //   if (stabilityData.value && sepoliaData.value && ethData.value){
      //     // console.log({ethdata:ethData.value.deployments.numDeployments});
      //     const sepolia = sepoliaData.value.deployments.numDeployments;
      //     const eth = ethData.value.deployments.numDeployments;
      //     const gtn = stabilityData.value.deployments.numDeployments;
      //     return [sepolia,eth,gtn];
      //   }else{
      //     return [];
      //   }
      // })
      // console.log(totalDeployments);



      return{
        // getSepolia,
        // getEth,
        // getStability,
        // sepoliaData,
        // ethData,
        // stabilityData,
        // sepoliaTimestamp,
        // ethTimestamp,
        // stabilityTimestamp,
        // totalDeployments,
        
    }
  }
}

  </script>


  <style scoped>
.home{
  width:100vw;
  height: 100vh;
}



  </style>