<template>
  <div class="home">
    <v-container fluid>
      <v-row>
        <h1>TradeTrust Dashboard</h1>
      </v-row>
      <v-row>
        <v-col cols="3" md="3">
            <v-select
            v-model="networkType"
            :items="network_types"
            label="Select Network Type"
            clearable
            ></v-select>
        </v-col>
        <v-col cols="3" md="3">
          <v-skeleton-loader
            :loading="loading"
            type="chip" >
            <v-select v-if="networks"
              v-model="selectedNetwork"
              :items="networks"
              label="Select Network"
              item-title="networkName"
              item-value="chainId"
              multiple
              clearable
              />
          </v-skeleton-loader>
        </v-col>
        
        <v-col>
          <v-select
            v-model="dataFilter"
            :items="datasets"
            label="Select Dataset"
            multiple
            clearable
            ></v-select>
        </v-col>
        <v-col>
          <v-slider
            v-model="num_days"
            :max="7"
            :min="1"
            :step="1"
            class="align-center"
            hide-details
            label="No. of Days"
            track-size="4"
          >
            <template v-slot:append>
              <v-text-field
                v-model="num_days"
                density="compact"
                style="width: 70px"
                type="number"
                hide-details
                single-line
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
        <!-- <v-col cols="1" md="1">
          <v-btn color="blue" size="large" @click="doFilter" text="Filter"/>
        </v-col> -->
        
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <!-- <NetworkTable v-if="totals" :data="totals" /> -->
          <BarChart :data="totals" :selectedNetwork="selectedNetwork" :dataset="dataFilter" />
        </v-col>
        
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <LineChart :dataset="dataFilter" :days="num_days" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <LineChartDeployment  :days="num_days" :selectedNetwork="selectedNetwork"/>
          
        </v-col>
        <v-col cols="12" md="6">
          <LineChartTokens :days="num_days" :selectedNetwork="selectedNetwork"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>




<script>
import { ref, onMounted, watch} from 'vue';

import { fetchData } from '@/utils';
import BarChart from '@/components/BarChart.vue';
import NetworkTable from '@/components/NetworkTable.vue';
import LineChart from '@/components/LineChart.vue';
import LineChartDeployment from '@/components/LineChartDeployment.vue';
import LineChartTokens from '@/components/LineChartTokens.vue';





export default {
  name: 'HomeView',
  components: {
    BarChart,
    LineChart,
    LineChartDeployment,
    LineChartTokens,
    NetworkTable,

  },
  data() {

    
    const history = ref(null);
    const showHistoryByChain = ref(false);
    const historyByChain = ref(null);
    const num_days = ref(7);
    
    
    
    const selectedNetwork = ref([]);
    const networkType = ref(null);
    const dataFilter = ref(null);


    const networks = ref(null);
    const totals = ref(null);

    const loading = ref(true);
    
    async function getNetworks () {
      loading.value = true;
      networks.value = await fetchData('networks');
      // console.log('totals',totals.value);
      // console.log('networks',networks.value);
      loading.value=false;
      
    }


    function getNetworkType(networkType){
      if(networkType){
        const filtered = networks.value.filter(network => network.network_type.toLowerCase() === networkType.value.toLowerCase());
        selectedNetwork.value = [...new Set(filtered.map(item => item.chainId))];
        console.log('testnets',selectedNetwork.value);
      }
    }
    onMounted( () => {
      getNetworks();
      // getHistory();
    });

    watch(selectedNetwork, () => {
      
      console.log('selectednetwork',selectedNetwork.value);
      }      
    );

    watch(dataFilter , () => {

    })

    watch(networkType , () =>{
      console.log('networktype',networkType.value);
      if (networkType.value){
        getNetworkType(networkType);
      }else{
        selectedNetwork.value=[];
      }
    })

    watch(num_days, ()=> {
      console.log('days',num_days.value);
      
    })



    

    

    return {
      totals,
      selectedNetwork,
      history,
      historyByChain,
      networks,
      network_types : ['Mainnet','Testnet'],
      networkType,
      datasets : ['Token Registries Created','Tokens Created'],
      dataFilter,
      num_days,
      showHistoryByChain,
      loading,
      
    };
  },
};
</script>

<style scoped>
.home{
  padding:20px;
}


</style>