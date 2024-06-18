<template>
    <div class="sepolia d-flex flex-column">
        <div>
            <SummaryComponent
              v-if="sepoliaData"
              :data="sepoliaData"
              :timestamp="sepoliaTimestamp"
              scannerUrl="https://sepolia.etherscan.io/address/"
              :refresh = "updateSepolia"
              class="summary"
            />
        </div>
        <div v-if="sepoliaData" class="tokenRegistry">
            <v-sheet max-width="1000">
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in sepoliaData.deployments.returnValues"
                            :key="index"
                            :registry="registry"
                            scannerUrl="https://sepolia.etherscan.io/address/"
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
import { ref, onMounted } from 'vue';
  
  export default {

    name: 'SepoliaView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
    },
    data(){
        const sepoliaData = ref(null);
        const sepoliaTimestamp = ref(null);

        const fetchData = async (url, dataRef, timestampRef) => {
            try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response not ok');
            }
            const result = await response.json();
            // console.log('result');
            // console.log(result);
            dataRef.value = result.data;  
            // console.log(typeof result.timestamp);
            timestampRef.value = (new Date((parseInt(result.timestamp)))).toLocaleString();
            // console.log('fetch data time  ' + timestampRef.value);
            } catch (err) {
            console.log(err);
            error.value = err.toString();
            }
        };

        const getSepolia = () => {
            console.log('fetching sepolia')
            fetchData(
                // 'https://tradetrust-app.netlify.app/.netlify/functions/sepolia-listen_combine',
                'https://tradetrust-app.netlify.app/.netlify/functions/sepolia-fetch',
                sepoliaData,
                sepoliaTimestamp
                );
            // console.log(sepoliaTimestamp);
        };

        const updateSepolia = async () =>{
            const response = await fetch('https://tradetrust-app.netlify.app/.netlify/functions/sepolia-background', {
                method: "POST",
            });
            console.log(response);
        }

        onMounted(()=>{
            getSepolia();
            console.log({output:sepoliaData});
        })

        return{
            sepoliaData,
            sepoliaTimestamp,
            getSepolia,
            fetchData,
            updateSepolia,
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
.sepolia {
  display: flex;
  flex-direction: column;
  padding: 20px; /* Optional: Add padding for better spacing */
}
.summary {
  margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
}

  
  </style>
  