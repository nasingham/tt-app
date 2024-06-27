<template>
  <div class="home">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <NetworkTable v-if="totals" :data="totals" @chooseNetwork="onNetworkSelected"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <BarChart v-if="totals && selectedNetwork" :data="totals" :network="selectedNetwork" />
          <BarChart v-if="totals && !selectedNetwork" :data="totals"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>




<script>
import { ref, onMounted, computed } from 'vue';

import { fetchData } from '@/utils';
import BarChart from '@/components/BarChart.vue';
import NetworkTable from '@/components/NetworkTable.vue';





export default {
  name: 'HomeView',
  components: {
    BarChart,
    NetworkTable,

  },
  data() {
    const totals = ref(null);
    const selectedNetwork = ref(null);
    const getTotals = async () => {
      totals.value = await fetchData('totals');
      console.log(totals.value);
    };

    onMounted(() => {
      getTotals();
    });

    const onNetworkSelected = (selectedNetworks) => {
      selectedNetwork.value = selectedNetworks;
      console.log('selected',selectedNetwork.value);
    }

    

    

    return {
      getTotals,
      totals,
      onNetworkSelected,
      selectedNetwork,
      
    };
  },
};
</script>

<style scoped>
.home{
  padding:20px;
}


</style>