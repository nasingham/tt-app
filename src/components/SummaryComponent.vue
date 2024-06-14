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
        <v-card v-if="data.deployments.uniqueStandalone"     
        elevation="3"
        >
          <v-card-title class="big-title">Standalones</v-card-title>
          <v-card-text class ="big-text">{{standalones}}</v-card-text>
        </v-card>

      </div>


      <div class="update">
        <p>Last updated: {{ timestamp }}</p> 
        <v-icon class="refresh-icon" @click="refreshData">mdi-refresh</v-icon>
      </div>
    </div>


    <div class="uniques">
      <v-card  class="unique-deployers">
        <v-card-title :style="{ backgroundColor: '#4da6e8' }">Wallet Addresses</v-card-title>
        <v-virtual-scroll
          class="scroller"
          :height="300"
          :items="data.deployments.uniqueDeployer"
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
          :items="data.deployments.uniqueFactory"
          :item-height="5"
          :width="300"
        >
          <template v-slot:default="{ item }">
            <a :href="scannerUrl + item" target="_blank">{{ item }}</a>
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  class="unique-registries" v-if="data.deployments.uniqueDeployed">
        <v-card-title :style="{ backgroundColor: '#4da6e8' }">Token Registries</v-card-title>
        <v-virtual-scroll
          class="scroller"
          :height="300"
          :items="data.deployments.uniqueDeployed"
          :item-height="5"
          :width="300"
        >
          <template v-slot:default="{ item }">
            <a :href="scannerUrl + item" target="_blank">{{ item }}</a>
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  class="unique-standalones" v-if="data.deployments.uniqueStandalone">
        <v-card-title :style="{ backgroundColor: '#4da6e8' }">Standalone Token Registries</v-card-title>
        <v-virtual-scroll
          class="scroller"
          :height="300"
          :items="data.deployments.uniqueStandalone"
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
    const titleDeployments = this.data.deployments.numDeployments;
    const titleCreated = this.data.deployments.numCreated;
    const standalones = this.data.deployments.uniqueStandalone && this.data.deployments.uniqueStandalone.length > 0 
    ? this.data.deployments.uniqueStandalone.length
    : 0;

    return {
      titleDeployments,
      titleCreated,
      standalones,
    }
  },
  methods:{
    refreshData() {
      this.refresh();
    }
  }
};
</script>

<style>
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
