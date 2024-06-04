<template>
  <div class="summary">
    <div class="header">
      <h2>Total number of deployments: {{ data.deployments.numDeployments }}</h2>
      <div class="update">
        <p>Last updated: {{ timestamp }}</p> 
        <v-icon class="refresh-icon" @click="refreshData">mdi-refresh</v-icon>
      </div>
    </div>
    <h2>Total number of Title Escrows created: {{ data.numCreated }}</h2>
    <div class="uniques">
      <v-card title="List of unique deployers" class="unique-deployers">
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
  padding: 10px;
}
.unique-deployers,
.unique-factory,
.unique-registries {
  margin-right: 20px;
  align-items: center;
}

.unique-deployers a,
.unique-factory a,
.unique-registries a{
  color:blue;
}
</style>
