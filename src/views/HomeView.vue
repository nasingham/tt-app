  <template>
    <div class="home">
      <v-sparkline
        :labels="totalDeployments.keys()"
        :model-value="totalDeployments"
        color="white"
        line-width="2"
        padding="16"
      ></v-sparkline>
  </div>
  </template>




  <script>
  import { ref, onMounted, computed } from 'vue';

  

  export default{
    name: 'HomeView',
    components:{
    },


    data() {

      
      const sepoliaData = ref(null);
      const ethData = ref(null);
      const stabilityData = ref(null);
      const sepoliaTimestamp = ref(null);
      const ethTimestamp = ref(null);
      const stabilityTimestamp = ref(null);
      const error = ref(null);

      const fetchData = async (url, dataRef, timestampRef) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response not ok');
          }
          const result = await response.json();
          console.log('result');
          console.log(result);
          dataRef.value = result.data;  
          console.log(typeof result.timestamp);
          timestampRef.value = (new Date((parseInt(result.timestamp)))).toLocaleString();
          console.log('fetch data time  ' + timestampRef.value);
        } catch (err) {
          console.log(err);
          error.value = err.toString();
        }
      };

      const getSepolia = () => {
        console.log('fetching sepolia')
          fetchData(
              'https://tradetrust-app.netlify.app/.netlify/functions/sepolia-listen_combine',
              sepoliaData,
              sepoliaTimestamp
            );
        console.log(sepoliaTimestamp);
      };
        

      const getEth = () => {
        console.log('fetching eth')
          fetchData(
            'https://tradetrust-app.netlify.app/.netlify/functions/eth-listen_combine',
            ethData,
            ethTimestamp
          );
      };

      const getStability = () => {
        console.log('fetching stability')
          fetchData(
            'https://tradetrust-app.netlify.app/.netlify/functions/stability-listen_combine',
            stabilityData,
            stabilityTimestamp
          );
        };


      onMounted(() => {
        getSepolia(); // Load the default tab's data
        getStability();
        getEth();
      });

      const totalDeployments = computed(()=>{
        if (stabilityData && sepoliaData && ethData){
          console.log(this.ethData.deployments);
          // const sepolia = sepoliaData.deployments.numDeployments;
          // const eth = ethData.deployments.numDeployments;
          // const gtn = stabilityData.deployments.numDeployments;
          // return {sepolia,eth,gtn};
        }else{
          console.log('data empty');
        }
      })



      return{
        getSepolia,
        getEth,
        getStability,
        sepoliaData,
        ethData,
        stabilityData,
        sepoliaTimestamp,
        ethTimestamp,
        stabilityTimestamp,
        totalDeployments,
        
    }
  }
}

  </script>


  <style scoped>




  </style>