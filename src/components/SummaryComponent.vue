<template>
  <div class="summary">
    <div class="header">
      <div class="big-cards">
        <v-card
        elevation="3"
        >
          <v-card-title class="big-title">Deployments</v-card-title>
          <v-card-text class ="big-text">{{titleDeployments}}</v-card-text>
        </v-card>
        <v-card
        
        elevation="3"
        >
          <v-card-title class="big-title">Title Escrows Created</v-card-title>
          <v-card-text class ="big-text">{{titleCreated}}</v-card-text>
        </v-card>
        <v-card v-if="data.uniqueStandalone"     
        elevation="3"
        >
          
          <v-card-title class="big-title">
            Standalones
            <v-icon class="info-icon" size="x-small" v-tooltip:end="'Number of registries that used the Title Escrow Factory without the Deployer'">mdi-information</v-icon>
          </v-card-title>
          <v-card-text class ="big-text">{{standalones}}</v-card-text>
        </v-card>

      </div>


      <div class="update">
        <p>Last updated: {{ timestamp }}</p> 
        <v-icon v-tooltip:top="'click to update data (in the background)'" class="refresh-icon" @click="refreshData">mdi-refresh</v-icon>
      </div>
    </div>


    <div class="uniques">
      <v-card  class="unique-deployers">
        <v-card-title :style="{ backgroundColor: '#4da6e8' }">Wallet Addresses</v-card-title>
        <v-virtual-scroll
          class="scroller"
          :height="300"
          :items="data.uniqueDeployer"
          :item-height="5"
        >
          <template v-slot:default="{ item }">
            <a :href="scannerUrl + item" target="_blank">{{ item }}</a>
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  class="unique-factory">
        <v-card-title :style="{ backgroundColor: '#4da6e8' }">Title Escrow Factories</v-card-title>
        <v-virtual-scroll
          class="scroller"
          :height="300"
          :items="data.uniqueFactory"
          :item-height="5"
          :width="300"
        >
          <template v-slot:default="{ item }">
            <a :href="scannerUrl + item" target="_blank">{{ item }}</a>
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
    <div class="tables">
      <!-- <v-card class="standard"  elevation="3"> -->
        <!-- <v-card-title :style="{ backgroundColor: '#4da6e8' }">Token Registries (Standard)</v-card-title> -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title style="background-color: #4da6e8; font-size:x-large;">Token Registries (Standard)</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table class="v-data-table"
            :headers="standardHeaders"
            :items="data.returnValues"
            :items-per-page="5"
            >
            
              <template #item.deployed.deployed="{ value }">
                  <a :href="scannerUrl + value" target="_blank" style="color:blue">
                    {{ value }}
                  </a>
              </template>
            </v-data-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
        
      <!-- </v-card> -->
        
      <v-card  class="unique-standalones" v-if="data.uniqueStandalone">
        <v-card-title :style="{ backgroundColor: '#4da6e8' }">Standalone Token Registries</v-card-title>
        <v-virtual-scroll
          class="scroller"
          :height="300"
          :items="data.uniqueStandalone"
          :item-height="5"
          :width="300"
        >
          <template v-slot:default="{ item }">
            <a :href="scannerUrl + item" target="_blank">{{ item }}</a>
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummaryComponent',
  props: {
    data: Object,
    timestamp: String,
    scannerUrl:String,
    refresh:Function,
  },
  data(){
    const titleDeployments = this.data.numDeployments;
    const titleCreated = this.data.numCreated;
    const standalones = this.data.uniqueStandalone && this.data.uniqueStandalone.length > 0 
    ? this.data.uniqueStandalone.length
    : 0;
    const standardHeaders = [{title:'Address', key:'deployed.deployed'},{title:'No. of tokens',key:'deployed.num_tokens'}];

    return {
      titleDeployments,
      titleCreated,
      standalones,
      standardHeaders,
    }
  },
  methods:{
    refreshData() {
      this.refresh();
    }
  }
};
</script>

<style scoped>

.summary {
  /* padding: 20px; */
  width:100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
}
.big-cards{
  width:80%;
  display:flex;
  justify-content:left;
  column-gap: 1%;
  padding:10px;
}
.big-title{
  background-color: #4da6e8;
}
.big-text{
  font-weight:bold;
  font-size:40px;
}
.update{
  display:flex;
}

.refresh-icon {
  cursor: pointer;
  font-size: 24px;
  color:#000;
  margin-left:5px;  
}
.standard{
  /* border-color: #000;
  border-width: medium; */
}
.uniques {
  margin-top: 10px;
  display: flex;
  column-gap:1%;
  padding: 10px;
}
.unique-deployers,
.unique-factory,
.unique-registries
.unique-standalones {
  align-items: center;
}

.unique-deployers a,
.unique-factory a,
.unique-registries a,
.unique-standalones a{
  color:blue;
}
.scroller{
  padding:10px;
}


</style>
