<template>
  <div>
    <v-card class="summary-box">
      <v-tabs v-model="activeTab" bg-color="primary">
        <v-tab value="sepolia" >Sepolia</v-tab>
        <v-tab value="eth" >Ethereum</v-tab>
        <v-tab value="gtn" >Stability GTN</v-tab>
      </v-tabs>
      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="sepolia">
          <SummaryComponent
            v-if="sepoliaData"
            :data="sepoliaData"
            :timestamp="sepoliaTimestamp"
            scannerUrl="https://sepolia.etherscan.io/address/"
            :refresh = "getSepolia"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="eth">
          <SummaryComponent
            v-if="ethData"
            :data="ethData"
            :timestamp="ethTimestamp"
            scannerUrl="https://etherscan.io/address/"
            :refresh="getEth"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="gtn">
          <SummaryComponent
            v-if="stabilityData"
            :data="stabilityData"
            :timestamp="stabilityTimestamp"
            scannerUrl="https://stability.blockscout.com/address/"
            :refresh="getStability"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>




<script>
import { ref, onMounted } from 'vue';
import SummaryComponent from '../components/SummaryComponent.vue';

export default{
  name: 'HomeView',
  components:{
    SummaryComponent
  },


  data() {

    const activeTab = ref(0);
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
        console.log(response);
        const result = await response.json();
        dataRef.value = result.data;
        timestampRef.value = new Date(result.timestamp).toLocaleString();
        console.log(timestampRef.value);
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


    return{
      activeTab,
      getSepolia,
      getEth,
      getStability,
      sepoliaData,
      ethData,
      stabilityData,
      sepoliaTimestamp,
      ethTimestamp,
      stabilityTimestamp,
    };
  },

  
} 

</script>


<style>

.summary-box {
  border: 1px solid black;
  padding: 20px;
  margin: 20px;
  height: 600px;
  width: 1320px;
}

.summary {
  padding: 20px;
}

.uniques{
  margin-top: 10px;
  display:flex;
  padding:10px;
}
.unique-deployers,
.unique-factory,
.unique-registries {
  margin-right: 20px;
  align-items: center;
}

.unique-deployers h3,
.unique-factory h3,
.unique-registries h3 {
  margin-bottom: 5px;
}



</style>