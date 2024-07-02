<template>
    <div class="tables">
      <v-card>
        <v-card-title style="background-color: #4da6e8; font-size:x-large;">Token Registries </v-card-title>
          
          <div class="buttons" >
            <v-skeleton-loader
              :loading="loading"
              type="chip"> 
              <v-chip-group v-if="num_standard && num_standalone"
                v-model="deploymentType"
                column
                multiple
              >
                <v-chip
                  :text="`Standard: ${num_standard}`"
                  value="standard"
                  variant="tonal"
                  filter
                  

                ></v-chip>
                <v-chip
                  :text="`Standalone: ${num_standalone}`"
                  value="standalone"
                  variant="tonal"
                  filter
                ></v-chip>
              </v-chip-group>
            </v-skeleton-loader>
          </div>
          <div class="filters">
            <v-text-field
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </div>
          <v-skeleton-loader
            :loading="loading"
            type="table"
            >
            <v-data-table class="v-data-table" v-if="deployments"
            v-model="selected"
            :headers="standardHeaders"
            :items="filteredDeployments"
            :items-per-page="5"
            :search="search"
            v-model:sort-by="sortBy"
            multi-sort
            return-object
            show-select
            >
            
              <template #item.tokenRegistry="{ value }">
                  <a :href="scannerUrl + value" target="_blank" style="color:blue; font-size: larger;">
                    {{ value }}
                  </a>
              </template>
              <template #item.num_tokens="{value}">
                <p style="font-size: larger;">{{ value }}</p>
              </template>
            </v-data-table>
          </v-skeleton-loader>
      </v-card>
    </div>
</template>

<script>
import { ref, watchEffect, onMounted} from 'vue';
import { fetchData } from '@/utils';

export default{
    name: 'DeploymentComponent',
    props: {
        // data: Object,
        scannerUrl: String,
        chainId : Number,
    },

    setup(props, {emit}){
        const deploymentType = ref([]);
        const selected = ref(null);
        const deployments = ref(null);
        const num_standalone = ref(null);
        const num_standard = ref(null);
        
        const loading = ref(true);

        const getUniqueDeployments = async () => {
            loading.value=true;
            console.log('fetching sepolia uniqueDeployments')
            deployments.value = await fetchData('uniqueDeployments',{chainId:props.chainId});
            // totalDeployments.value = Object.keys(uniqueDeployments.value).length;
            num_standalone.value = deployments.value.reduce((acc, obj) => acc + (obj.standalone === 1 ? 1 : 0), 0);
            num_standard.value = deployments.value.reduce((acc, obj) => acc + (obj.standalone === 0 ? 1 : 0), 0);
            loading.value=false;
        };

        // const deployments = this.data;
        // const standardHeaders = [{title:'Address', key:'tokenRegistry'},{title:'No. of tokens',key:'num_tokens'}];
        // console.log(deployments);
        
        watchEffect(() => {
          emit('generate', selected.value);
        })

        onMounted(()=>{
            getUniqueDeployments();
        })

      
      return{
        deployments,
        standardHeaders : [{title:'Address', key:'tokenRegistry'},{title:'No. of tokens',key:'num_tokens'}],
        search: '',
        num_standalone,
        num_standard,
        deploymentType,
        selected,
        sortBy: [{ key: 'num_tokens', order: 'desc' }],
        loading,
        
      }
      
    },
    computed: {
      filteredDeployments() {
          console.log(this.deploymentType)
          if (this.deploymentType.length === 0) {
            return this.deployments;
          }
          return this.deployments.filter(deployment => {
            if (this.deploymentType.includes('standard') && deployment.standalone === 0) {
              return true;
            }
            if (this.deploymentType.includes('standalone') && deployment.standalone === 1) {
              return true;
            }
            return false;
          });
        },
        
      }



}



</script>

<style scoped>

.buttons{
  margin-left:10px;
}





</style>