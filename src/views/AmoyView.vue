<template>
    <div class="amoy">
        <div>
            <SummaryComponent
                v-if="amoyData"
                :data="amoyData"
                :timestamp="amoyTimestamp"
                scannerUrl="https://amoy.polygonscan.com/address/"
                :refresh = "updateData"
                class="summary"
            />
        </div>
        <div v-if="amoyData" class="tokenRegistry">
            <v-sheet max-width="1300">
                <v-slide-group
                class="vsg-1"
                show-arrows>
                    <v-slide-group-item>
                        <TokenRegistryComponent 
                            v-for="(registry, index) in amoyData.returnValues"
                            :key="index"
                            :registry="registry"
                            scannerUrl="https://amoy.polygonscan.com/address/"
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

    name: 'AmoyView',
    components: {
        SummaryComponent,
        TokenRegistryComponent,
    },
    data(){
        const storeName = "amoy";
        const amoyData = ref(null);
        const amoyTimestamp = ref(null);

        const fetchData = async (storeName, dataRef, timestampRef) => {
            try {
            // const response = await fetch(`http://localhost:9999/.netlify/functions/fetch?storeName=${storeName}`);
            const response = await fetch(`https://tradetrust-scan.netlify.app/.netlify/functions/fetch?storeName=${storeName}`);
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

        const getAmoy = () => {
            console.log('fetching amoy')
            fetchData(
                storeName,
                // 'https://tradetrust-scan.netlify.app/.netlify/functions/amoy-listen_combine',
                // 'http://localhost:9999/.netlify/functions/amoy-listen_combine',
                amoyData,
                amoyTimestamp
                );
            // console.log(stabilityTimestamp);
        };
        const updateData = async () =>{
            console.log('updating');
            const response = await fetch(`https://tradetrust-scan.netlify.app/.netlify/functions/update-background?storeName=${storeName}`, {
                method: "POST",
            });
            // const response = await fetch(`http://localhost:8888/.netlify/functions/update-background?storeName=${storeName}`, {
            //     method: "POST",
            // });
            console.log(response);
        }

        onMounted(()=>{
            getAmoy();
        })

        return{
            amoyData,
            amoyTimestamp,
            getAmoy,
            fetchData,
            updateData,
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
.amoy {
    display: flex;
    flex-direction: column;
    padding: 20px; /* Optional: Add padding for better spacing */
}
.summary {
  margin-bottom: 20px; /* Add some margin to create space between summary and tokenRegistry */
}

  
  </style>
  