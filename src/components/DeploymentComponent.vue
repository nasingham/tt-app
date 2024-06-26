<template>
    <div class="tables" v-if="deployments">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title style="background-color: #4da6e8; font-size:x-large; font-weight: bold;">Token Registries</v-expansion-panel-title>
            <v-expansion-panel-text >
              <div class="buttons">
                <v-chip-group
                  v-model="deploymentType"
                  column
                  multiple
                >
                  <v-chip
                    :text="`Standard: ${num_standard}`"
                    value="standard"
                    variant="outlined"
                    filter
                  ></v-chip>
                  <v-chip
                    :text="`Standalone: ${num_standalone}`"
                    value="standalone"
                    variant="outlined"
                    filter
                  ></v-chip>
                </v-chip-group>
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
              <v-data-table class="v-data-table"
              v-model="selected"
              :headers="standardHeaders"
              :items="filteredDeployments"
              :items-per-page="5"
              :search="search"
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

            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
import { ref, watchEffect} from 'vue';

export default{
    name: 'DeploymentComponent',
    props: {
        data: Object,
        scannerUrl: String,
        chainId : Number,
    },

    data(){
        const deploymentType = ref([]);
        const selected = ref(null);
        const deployments = this.data;
        const standardHeaders = [{title:'Address', key:'tokenRegistry'},{title:'No. of tokens',key:'num_tokens'}];
        console.log(deployments);
        const num_standalone = deployments.reduce((acc, obj) => acc + (obj.standalone === 1 ? 1 : 0), 0);
        const num_standard = deployments.reduce((acc, obj) => acc + (obj.standalone === 0 ? 1 : 0), 0);
        
        watchEffect(() => {
          this.$emit('generate', selected.value);
        })
      
      return{
        deployments,
        standardHeaders,
        search: '',
        num_standalone,
        num_standard,
        deploymentType,
        selected
        
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

<style>




</style>