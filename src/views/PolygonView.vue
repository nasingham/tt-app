<template>
    <div class="polygon d-flex flex-column">
        <div>
            <SummaryComponent
              v-if="totals"
              :data="totals"
              class="summary"
            />
        </div>
        <div>
            <DeploymentComponent v-if="uniqueDeployments"
             :data="uniqueDeployments" 
             scannerUrl="https://polygonscan.com/address/"
             :chainId="chainId"
             @generate="handleSelection"
             />
        </div>
        <div v-if="selection" class="tokenRegistry">
            <v-sheet max-width="1000">
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in selection"
                            :key="index"
                            :data="registry.tokenRegistry"
                            :chainId="chainId"
                            scannerUrl="https://polygonscan.com/address/"
                        />
                    </v-slide-group-item>
                </v-slide-group>
            </v-sheet>
        </div>
    </div>
</template>
  
  <script>
import SummaryComponent from '@/components/SummaryComponent.vue';
import TokenRegistryComponent from '@/components/TokenRegistryComponent.vue';
import DeploymentComponent from '@/components/DeploymentComponent.vue';
import { ref, onMounted } from 'vue';
import { fetchData } from '@/utils';
  
  export default {

    name: 'PolygonView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
        DeploymentComponent,
    },
    data(){
        const uniqueDeployments = ref(null);
        const totalDeployments = ref(0);
        const sepoliaTimestamp = ref(null);
        const chainId = 137;
        const totals = ref(null);
        const selection = ref(null);

        const getTotals = async() => {
            totals.value = await fetchData('totalsByChain', {chainId:chainId});
            // console.log(result[0].totalDeployments);
        }

        const getUniqueDeployments = async () => {
            console.log('fetching polygon uniqueDeployments')
            uniqueDeployments.value = await fetchData('uniqueDeployments',{chainId:chainId});
            // totalDeployments.value = Object.keys(uniqueDeployments.value).length;

        };

        const handleSelection = (selected) => {
            selection.value = selected;
            console.log('prop',selection.value);
        }

        onMounted(()=>{
            getTotals();
            getUniqueDeployments();
        })

        return{
            // sepoliaData,
            uniqueDeployments,
            totalDeployments,
            sepoliaTimestamp,
            selection,
            chainId,
            getUniqueDeployments,
            fetchData,
            handleSelection,
            totals,
            
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
    .polygon {
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
    }
    .summary {
    margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
    }

  
  </style>
  



