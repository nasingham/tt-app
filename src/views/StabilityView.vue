<template>
    <div class="stability">
        <div>
            <SummaryComponent
                v-if="stabilityData"
                :data="stabilityData"
                :timestamp="stabilityTimestamp"
                scannerUrl="https://stability.blockscout.com/address/"
                :refresh = "getStability"
                class="summary"
            />
        </div>
        <div v-if="stabilityData" class="tokenRegistry">
            <v-sheet max-width="1300">
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in stabilityData.deployments.returnValues"
                            :key="index"
                            :registry="registry"
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
import { ref, onMounted } from 'vue';
import TokenRegistryComponent from '@/components/TokenRegistryComponent.vue';
  
  export default {

    name: 'StabilityView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
    },
    data(){
        const stabilityData = ref(null);
        const stabilityTimestamp = ref(null);

        const fetchData = async (url, dataRef, timestampRef) => {
            try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response not ok');
            }
            const result = await response.json();
            console.log('result');
            console.log(result);
            dataRef.value = result.data;  
            console.log(typeof result.timestamp);
            timestampRef.value = (new Date((parseInt(result.timestamp)))).toLocaleString();
            console.log('fetch data time  ' + timestampRef.value);
            } catch (err) {
            console.log(err);
            error.value = err.toString();
            }
        };

        const getStability = () => {
            console.log('fetching stability')
            fetchData(
                'https://tradetrust-app.netlify.app/.netlify/functions/stability-listen_combine',
                stabilityData,
                stabilityTimestamp
                );
            // console.log(stabilityTimestamp);
        };

        onMounted(()=>{
            getStability();
        })

        return{
            stabilityData,
            stabilityTimestamp,
            getStability,
            fetchData,
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
.stability {
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
}
.summary {
  margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
}

  
  </style>
  