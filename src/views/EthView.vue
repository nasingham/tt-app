<template>
    <div class="eth">
        <div>
            <SummaryComponent
                v-if="ethData"
                :data="ethData"
                :timestamp="ethTimestamp"
                scannerUrl="https://etherscan.io/address/"
                :refresh = "getEth"
                class="summary"
            />
        </div>
        <div v-if="ethData" class="tokenRegistry">
            <v-sheet max-width="1300">
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in ethData.deployments.returnValues"
                            :key="index"
                            :registry="registry"
                            scannerUrl="https://etherscan.io/address/"
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

    name: 'EthView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
    },
    data(){
        const ethData = ref(null);
        const ethTimestamp = ref(null);

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

        const getEth = () => {
            console.log('fetching eth')
            fetchData(
                'https://tradetrust-app.netlify.app/.netlify/functions/eth-listen_combine',
                ethData,
                ethTimestamp
                );
            // console.log(ethTimestamp);
        };

        onMounted(()=>{
            getEth();
        })

        return{
            ethData,
            ethTimestamp,
            getEth,
            fetchData,
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
.eth {  
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
}
.summary {
  margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
}

  </style>
  