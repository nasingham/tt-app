<template>
  <div class="summary">
    <div class="header">
      <div class="big-cards">
        <v-card
        elevation="3"
        >
          <v-card-title class="big-title">Deployments</v-card-title>
          <v-card-text class ="big-text">{{ titleDeployments }}</v-card-text>
        </v-card>
        <v-card
        
        elevation="3"
        >
          <v-card-title class="big-title">Title Escrows Created</v-card-title>
          <v-card-text class ="big-text">{{ titleCreated }}</v-card-text>
        </v-card>
        <!-- <v-card v-if="data.uniqueStandalone"     
        elevation="3"
        > -->
          
          <!-- <v-card-title class="big-title">
            Standalones
            <v-icon class="info-icon" size="x-small" v-tooltip:end="'Number of registries that used the Title Escrow Factory without the Deployer'">mdi-information</v-icon>
          </v-card-title>
          <v-card-text class ="big-text">{{standalones}}</v-card-text>
        </v-card> -->

      </div>


      <!-- <div class="update">
        <p>Last updated: {{ timestamp }}</p> 
        <v-icon v-tooltip:top="'click to update data (in the background)'" class="refresh-icon" @click="refreshData">mdi-refresh</v-icon>
      </div> -->
    </div>


    <!-- <div class="uniques">
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
    </div> -->
      
        
      <!-- <v-card  class="unique-standalones" v-if="data.uniqueStandalone">
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
      </v-card> -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: 'SummaryComponent',
  props: {
    data: Object,
    // timestamp: String,
    // scannerUrl:String,
    // refresh:Function,
  },
  data(){
    // console.log(this.data);
    const titleDeployments = this.data[0].totalDeployments;
    const titleCreated = this.data[0].totalEscrows;
    // const standalones = this.data.uniqueStandalone && this.data.uniqueStandalone.length > 0 
    // ? this.data.uniqueStandalone.length
    // : 0;

    return {
      titleDeployments,
      titleCreated,
      // standalones,
      // standardHeaders,
    }
  },
  methods:{
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
