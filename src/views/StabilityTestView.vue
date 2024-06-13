<template>
    <div class="stabilityTest">
        <div>
            <SummaryComponent
                v-if="stabilityTestData"
                :data="stabilityTestData"
                :timestamp="stabilityTestTimestamp"
                scannerUrl="https://stability-testnet.blockscout.com/address/"
                :refresh = "getStabilityTest"
                class="summary"
            />
        </div>
        <div v-if="stabilityTestData" class="tokenRegistry">
            <v-sheet max-width="1300">
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in stabilityTestData.deployments.returnValues"
                            :key="index"
                            :registry="registry"
                            scannerUrl="https://stability-testnet.blockscout.com/address/"
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

    name: 'StabilityTestView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
    },
    data(){
        const stabilityTestData = ref(null);
        const stabilityTestTimestamp = ref(null);

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

        const getStabilityTest = () => {
            console.log('fetching stability')
            fetchData(
                'https://tradetrust-app.netlify.app/.netlify/functions/stabilityTest-listen_combine',
                // 'http://localhost:9999/.netlify/functions/stabilityTest-listen_combine',
                stabilityTestData,
                stabilityTestTimestamp
                );
            // console.log(stabilityTimestamp);
        };

        onMounted(()=>{
            getStabilityTest();
        })

        return{
            stabilityTestData,
            stabilityTestTimestamp,
            getStabilityTest,
            fetchData,
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
.stabilityTest {
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
}
.summary {
  margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
}

  
  </style>
  