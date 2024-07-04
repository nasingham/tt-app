<template>
    <div class="network d-flex flex-column">
        <div>
            <SummaryComponent
            :chainId="chainId"
              class="summary"
            />
        </div>
        <div>
            <DeploymentComponent
             :scannerUrl="explorerUrl"
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
                            :scannerUrl="explorerUrl"
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
import { ref, onMounted, watch } from 'vue';
import { fetchData } from '@/utils';
import { useRoute } from 'vue-router';
  
  export default {

    name: 'NetworkView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
        DeploymentComponent,
    },
    data(){

        const route = useRoute();
        const chainId = ref(null);
        let chainInfo;
        const explorerUrl = ref(null);

        async function getChainInfo (param) {
            // console.log('getting chainInfo',param);
            chainId.value = Number(param);
            // console.log('chainid',chainId.value);
            chainInfo = await fetchData('chainInfo', {chainId:param}); 
            // console.log('chaininfo', chainInfo);
            explorerUrl.value = chainInfo.explorerUrl;
            // console.log('explorerUrl',explorerUrl.value);

        }
        const selection = ref(null);



        const handleSelection = (selected) => {
            selection.value = selected;
            console.log('prop',selection.value);
        }



        onMounted(() => {
            console.log('mounting');
            getChainInfo(route.params.id);
        });

        watch(
            () => route.params.id,
            (newId) => {getChainInfo(newId);},
            { immediate: true }
        );

        return{
            selection,
            chainId,
            handleSelection,
            explorerUrl,
            
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
    .network {
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
    }
    .summary {
    margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
    }
  </style>
  