<template>
  <v-btn @click="showSepolia">Sepolia</v-btn>
  <v-btn @click="showMainnet">Ethereum</v-btn>
  <div v-if="Sepolia" class="summary">
    <h2>Total number of deployments: {{ sepoliaData.deployments.numDeployments }}</h2>
    <h2>Total number of Title Escrows created: {{ sepoliaData.numCreated }}</h2>
  
    <div class="uniques">
      <v-card  title="List of unique deployers" class="unique-deployers">
        <v-virtual-scroll :height="300" :items= sepoliaData.deployments.uniqueDeployer :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  title="List of Title Escrow Factories" class="unique-factory">
        <h3>List of Title Escrow Factories</h3>
        <v-virtual-scroll :height="300" :items= sepoliaData.deployments.uniqueFactory :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
  </div>
  <div v-if="Mainnet" class="summary">
    <h2>Total number of deployments: {{ mainnetData.deployments.numDeployments }}</h2>
    <h2>Total number of Title Escrows created: {{ mainnetData.numCreated }}</h2>
  
    <div class="uniques">
      <v-card  title="List of unique deployers" class="unique-deployers">
        <v-virtual-scroll :height="300" :items= mainnetData.deployments.uniqueDeployer :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  title="List of Title Escrow Factories" class="unique-factory">
        <h3>List of Title Escrow Factories</h3>
        <v-virtual-scroll :height="300" :items= mainnetData.deployments.uniqueFactory :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
  </div>
</template>




<script>
import { ref } from 'vue';

export default{
  name: 'HomeView',


  data() {

    const Sepolia = ref(false);
    const Mainnet = ref(false);

    const showSepolia = async () => {
      Sepolia.value = true;
      try{
      const response = await fetch ('./.netlify/functions/sepolia-listen_combine');
      if (!response.ok){
        throw new Error('Network response not ok');
      }
      console.log(response);
      const result = await response.json();
      console.log(result);
      this.sepoliaData = result

    
    } catch (error){
      console.log(error)
      this.error = error.toString();
    }
    }

    const showMainnet = async () => {
      Mainnet.value = true;
      try{
      const response = await fetch ('./.netlify/functions/eth-listen_combine');
      if (!response.ok){
        throw new Error('Network response not ok');
      }
      console.log(response);
      const result = await response.json();
      console.log(result);
      this.mainnetData = result

    
    } catch (error){
      console.log(error)
      this.error = error.toString();
    }
    }

    return{
      sepoliaData : null,
      mainnetData : null,
      showSepolia,
      Sepolia,
      Mainnet,
      showMainnet,
    };
  }
}

</script>


<style>
.summary {
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
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