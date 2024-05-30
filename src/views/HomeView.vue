<template>
<div>
  <div class="buttons">
    <v-btn @click="showSepolia">Sepolia</v-btn>
    <v-btn @click="showEth">Ethereum</v-btn>
    <v-btn @click="showStability">Stability GTN</v-btn>
  </div>
  <div v-if="Sepolia" class="summary">
    <!-- <SummaryComponent data = "sepoliaData"></SummaryComponent> -->
    <h2>Total number of deployments: {{ sepoliaData.deployments.numDeployments }}</h2>
    <h2>Total number of Title Escrows created: {{ sepoliaData.numCreated }}</h2>
    <p>Last updated: {{ sepoliaTimestamp }}</p>
  
    <div class="uniques">
      <v-card  title="List of unique deployers" class="unique-deployers">
        <v-virtual-scroll :height="300" :items= sepoliaData.deployments.uniqueDeployer :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  title="List of Title Escrow Factories" class="unique-factory">
        <v-virtual-scroll :height="300" :items= sepoliaData.deployments.uniqueFactory :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
  </div>
  <div v-if="Eth" class="summary">
    <h2>Total number of deployments: {{ ethData.deployments.numDeployments }}</h2>
    <h2>Total number of Title Escrows created: {{ ethData.numCreated }}</h2>
    <p>Last updated: {{ ethTimestamp }}</p>
    <div class="uniques">
      <v-card  title="List of wallet addresses" class="unique-deployers">
        <v-virtual-scroll :height="300" :items= ethData.deployments.uniqueDeployer :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  title="List of Title Escrow Factories" class="unique-factory">
        <v-virtual-scroll :height="300" :items= ethData.deployments.uniqueFactory :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
  </div>
  <div v-if="Stability" class="summary">
    <h2>Total number of deployments: {{ stabilityData.deployments.numDeployments }}</h2>
    <h2>Total number of Title Escrows created: {{ stabilityData.numCreated }}</h2>
    <p>Last updated: {{ stabilityTimestamp }}</p>
    <div class="uniques">
      <v-card  title="List of unique deployers" class="unique-deployers">
        <v-virtual-scroll :height="300" :items= stabilityData.deployments.uniqueDeployer :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  title="List of Title Escrow Factories" class="unique-factory">
        <v-virtual-scroll :height="300" :items= stabilityData.deployments.uniqueFactory :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
  </div>
</div>
</template>




<script>
import { ref } from 'vue';
// import SummaryComponent from '../components/SummaryComponent.vue';

export default{
  name: 'HomeView',
  // components:{
    // SummaryComponent
  // },


  data() {

    const Sepolia = ref(false);
    const Eth = ref(false);
    const Stability = ref(false);

    const showSepolia = async () => {
      Sepolia.value = true;
      try{
      // const response = await fetch ('./.netlify/functions/sepolia-listen_combine');
      const response = await fetch ('https://tradetrust-app.netlify.app/.netlify/functions/sepolia-listen_combine');
      if (!response.ok){
        throw new Error('Network response not ok');
      }
      console.log(response);
      const result = await response.json();
      console.log(result);
      this.sepoliaData = result.data;
      this.sepoliaTimestamp = (new Date(result.timestamp)).toLocaleString();

    
    } catch (error){
      console.log(error)
      this.error = error.toString();
    }
    }

    const showEth = async () => {
      Eth.value = true;
      try{
      // const response = await fetch ('./.netlify/functions/eth-listen_combine');
      const response = await fetch ('https://tradetrust-app.netlify.app/.netlify/functions/eth-listen_combine');
      if (!response.ok){
        throw new Error('Network response not ok');
      }
      console.log(response);
      const result = await response.json();
      console.log(result);
      this.ethData = result.data;
      this.ethTimestamp = (new Date(result.timestamp)).toLocaleString();

    
    } catch (error){
      console.log(error)
      this.error = error.toString();
    }
    }

    const showStability = async () => {
      Stability.value = true;
      try{
      // const response = await fetch ('./.netlify/functions/stability-listen_combine');
      const response = await fetch ('https://tradetrust-app.netlify.app/.netlify/functions/stability-listen_combine');
      if (!response.ok){
        throw new Error('Network response not ok');
      }
      console.log(response);
      const result = await response.json();
      console.log(result);
      this.stabilityData = result.data;
      this.stabilityTimestamp = (new Date(result.timestamp)).toLocaleString();

    
    } catch (error){
      console.log(error)
      this.error = error.toString();
    }
    }

    return{
      sepoliaData : null,
      ethData : null,
      stabilityData : null,
      showSepolia,
      Sepolia,
      Eth,
      Stability,
      showEth,
      showStability,
      sepoliaTimestamp:null,
      ethTimestamp : null,
      stabilityTimestamp : null,
    };
  }
}

</script>


<style>
.summary {
  padding: 20px;
}



.buttons{
  margin-top:10px;
}

.buttons button{
  margin-right:5px;
}

.uniques{
  margin-top: 10px;
  display:flex;
  padding:10px;
}
.unique-deployers,
.unique-factory {
  margin-right: 20px;
  align-items: center;
}

.unique-deployers h3,
.unique-factory h3 {
  margin-bottom: 5px;
}



</style>