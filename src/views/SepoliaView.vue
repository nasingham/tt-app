<template>
    <div class="sepolia">
        <SummaryComponent
              v-if="sepoliaData"
              :data="sepoliaData"
              :timestamp="sepoliaTimestamp"
              scannerUrl="https://sepolia.etherscan.io/address/"
              :refresh = "getSepolia"
            />

    </div>
</template>
  
  <script>
import SummaryComponent from '@/components/SummaryComponent.vue';
import { ref, onMounted } from 'vue';
  
  export default {

    name: 'SepoliaView',
    components: {
        SummaryComponent,
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

        const getSepolia = () => {
            console.log('fetching sepolia')
            fetchData(
                'https://tradetrust-app.netlify.app/.netlify/functions/sepolia-listen_combine',
                sepoliaData,
                sepoliaTimestamp
                );
            // console.log(sepoliaTimestamp);
        };

        onMounted(()=>{
            getSepolia();
        })

        return{
            sepoliaData,
            sepoliaTimestamp,
            getSepolia,
            fetchData,
        }
    }


  }
  </script>
  
  <style scoped>
  /* Add your styles here if needed */
  
  </style>
  