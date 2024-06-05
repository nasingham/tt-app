<template>
  <div class="summary">
    <div class="header">
      <div class="big-cards">
        <v-card
        :title="titleDeployments"
        variant="tonal"
        elevation="3"
        color="light-blue-darken-3">
        </v-card>
        <v-card
        :title="titleCreated"
        variant="tonal"
        elevation="3">
        </v-card>
      </div>


      <div class="update">
        <p>Last updated: {{ timestamp }}</p> 
        <v-icon class="refresh-icon" @click="refreshData">mdi-refresh</v-icon>
      </div>
    </div>
    <div class="uniques">
      <v-card title="List of Wallet Addresses" class="unique-deployers">
        <v-virtual-scroll
          :height="300"
          :items="data.deployments.uniqueDeployer"
          :item-height="5"
          :width="400"
        >
          <template v-slot:default="{ item }">
            <a :href="scannerUrl + item" target="_blank">{{ item }}</a>
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card title="List of Title Escrow Factories" class="unique-factory">
        <v-virtual-scroll
          :height="300"
          :items="data.deployments.uniqueFactory"
          :item-height="5"
          :width="400"
        >
          <template v-slot:default="{ item }">
            <a :href="scannerUrl + item" target="_blank">{{ item }}</a>
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card title="List of Token Registries" class="unique-registries" v-if="data.deployments.uniqueDeployed">
        <v-virtual-scroll
          :height="300"
          :items="data.deployments.uniqueDeployed"
          :item-height="5"
          :width="400"
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
    const titleDeployments = "Deployments: " + this.data.deployments.numDeployments;
    const titleCreated = "Title Escrows Created: " + this.data.numCreated

    return {
      titleDeployments,
      titleCreated,
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
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.big-cards{
  display:flex;
  column-gap:10px;
  padding:10px;
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
  column-gap:20px;
  padding: 10px;
}
.unique-deployers,
.unique-factory,
.unique-registries {
  align-items: center;
}

.unique-deployers a,
.unique-factory a,
.unique-registries a{
  color:blue;
}
</style>
