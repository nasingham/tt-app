<template>
    <div class="eth">
        <SummaryComponent
              v-if="ethData"
              :data="ethData"
              :timestamp="ethTimestamp"
              scannerUrl="https://etherscan.io/address/"
              :refresh = "getEth"
              class="summary"
            />

    </div>
</template>
  
  <script>
import SummaryComponent from '@/components/SummaryComponent.vue';
import { ref, onMounted } from 'vue';
  
  export default {

    name: 'EthView',
    components: {
        SummaryComponent,
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
  .summary{
    position: absolute;
    top:0;
    left:0;
    margin-left:50px;
  }
  </style>
  