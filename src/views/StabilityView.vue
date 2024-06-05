<template>
    <div class="stability">
        <SummaryComponent
              v-if="stabilityData"
              :data="stabilityData"
              :timestamp="stabilityTimestamp"
              scannerUrl="https://stability.blockscout.com/address/"
              :refresh = "getStability"
              class="summary"
            />

    </div>
</template>
  
  <script>
import SummaryComponent from '@/components/SummaryComponent.vue';
import { ref, onMounted } from 'vue';
  
  export default {

    name: 'StabilityView',
    components: {
        SummaryComponent,
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
  .summary{
    position: absolute;
    top:0;
    left:0;
    margin-left:50px;
  }
  
  </style>
  