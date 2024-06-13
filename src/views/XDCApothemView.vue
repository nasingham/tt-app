<template>
    <div class="apothem">
        <div>
            <SummaryComponent
                v-if="apothemData"
                :data="apothemData"
                :timestamp="apothemTimestamp"
                scannerUrl="https://apothem.blocksscan.io/address/"
                :refresh = "getApothem"
                class="summary"
            />
        </div>
        <div v-if="apothemData" class="tokenRegistry">
            <v-sheet max-width="1300">
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in apothemData.deployments.returnValues"
                            :key="index"
                            :registry="registry"
                            scannerUrl="https://apothem.blocksscan.io/address/"
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
        const apothemData = ref(null);
        const apothemTimestamp = ref(null);

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

        const getApothem = () => {
            console.log('fetching stability')
            fetchData(
                'https://tradetrust-app.netlify.app/.netlify/functions/apothem-listen_combine',
                // 'http://localhost:9999/.netlify/functions/apothem-listen_combine',
                apothemData,
                apothemTimestamp
                );
            // console.log(stabilityTimestamp);
        };

        onMounted(()=>{
            getApothem();
        })

        return{
            apothemData,
            apothemTimestamp,
            getApothem,
            fetchData,
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
.apothem {
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
}
.summary {
  margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
}

  
  </style>
  