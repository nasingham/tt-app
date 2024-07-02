<template>
    <div class="gtn d-flex flex-column">
        <div>
            <SummaryComponent
            :chainId="chainId"
              class="summary"
            />
        </div>
        <div>
            <DeploymentComponent 
             scannerUrl="https://stability.blockscout.com/address/"
             :chainId="chainId"
             @generate="handleSelection"
             />
        </div>
        <div v-if="selection" class="tokenRegistry">
            <v-sheet>
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in selection"
                            :key="index"
                            :data="registry.tokenRegistry"
                            :chainId="chainId"
                            scannerUrl="https://stability.blockscout.com/address/"
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
  
  export default {

    name: 'StabilityView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
        DeploymentComponent,
    },
    data(){
        const sepoliaTimestamp = ref(null);
        const chainId = 101010;
        const selection = ref(null);

        const handleSelection = (selected) => {
            selection.value = selected;
            console.log('prop',selection.value);
        }

        return{
            sepoliaTimestamp,
            selection,
            chainId,
            handleSelection,
            
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
    .gtn {
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
    }
    .summary {
    margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
    }

  
  </style>
  



  