<template>
  <div class="summary">
    <div class="header">
      <div class="big-cards">
        <v-card
        elevation="3"
        >
          <v-card-title class="big-title">Deployments</v-card-title>
          <v-skeleton-loader
            :loading="loading"
            type="subtitle">
            <v-card-text v-if="titleDeployments" class ="big-text">{{ titleDeployments }}</v-card-text>
          </v-skeleton-loader>
        </v-card>
        <v-card
        
        elevation="3"
        >
          <v-card-title class="big-title">Title Escrows Created</v-card-title>
          <v-skeleton-loader
            :loading="loading"
            type="subtitle">
            <v-card-text v-if="titleCreated" class ="big-text">{{ titleCreated }}</v-card-text>
          </v-skeleton-loader>
        </v-card>
  

      </div>

    </div>
  </div>
</template>

<script>
import { fetchData } from '@/utils';
import { ref, onMounted, watch } from 'vue';

export default {
  name: 'SummaryComponent',
  props: {
    chainId : Number,

  },
  setup(props){

    const totals = ref(null);
    const titleDeployments = ref(null);
    const titleCreated = ref(null);
    const loading = ref(true);

    async function getTotals () {
      loading.value=true;
      totals.value = await fetchData('totalsByChain', {chainId:props.chainId});
      console.log('totals', totals.value);
      titleDeployments.value = totals.value[0].totalDeployments;
      titleCreated.value = totals.value[0].totalEscrows;
      loading.value=false;
    }
   
    onMounted(()=>{
      getTotals();
    })

    watch(
            () => props.chainId ,
            () => {getTotals();},
            { immediate: true }
        );

    return {
      titleDeployments,
      titleCreated,
      loading,
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
