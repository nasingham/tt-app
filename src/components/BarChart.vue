<template>
    <div class="Bar">
        <v-card elevation="3" rounded="lg">
            <v-card-title style="background-color: #4da6e8;" class="justify-center">Total Token Registries and Tokens Created by Network</v-card-title>
                <v-skeleton-loader
                    :loading="loading"
                    type="card"
                >
                    <Bar v-if="chartData"
                        :options="chartOptions"
                        :data="chartData">
                    </Bar>
                </v-skeleton-loader>
            
        </v-card>





    </div>




</template>


<script>
import { onMounted, ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { fetchData } from '@/utils';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ToggleChips from './toggleChips.vue';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);



export default{
    name: 'BarChart',
    components:{
        Bar,
    },
    props:{
        selectedNetwork : Array,
        dataset : Array,
    },
    setup(props){

        const chartData = ref(null);
        
        const totals = ref(null);

        const filteredTotals = ref([]);

        const loading = ref(true);

        async function getTotals(){
            loading.value=true;
            console.log('getting totals');
            totals.value = await fetchData('totals');
            if (totals.value){
                filteredTotals.value = totals.value;
                // console.log('filteredTotals',filteredTotals.value);
                const processedData = [];
                const showDeployments = ref(true);
                const showTitles = ref(true);
                const networks = props.selectedNetwork.length ? props.selectedNetwork : [1, 50, 51, 137, 80002, 101010, 11155111, 20180427];
                // console.log('networks',networks);
                filteredTotals.value = filteredTotals.value.filter(item => networks.includes(item.chainId));
                // console.log('filteredTotals',filteredTotals.value);    
                if (props.dataset){
                    // console.log('dataset',dataset);
                    showDeployments.value = props.dataset.includes('Token Registries Created');
                    // console.log('showD',showDeployments.value);
                    showTitles.value = props.dataset.includes('Tokens Created');
                    // console.log('showT',showTitles.value);
                }
                if (showDeployments.value) {
                    processedData.push({
                        label: 'Token Registry Created',
                        backgroundColor: '#FF8200',
                        data: filteredTotals.value.map(item => item.total_deployments),
                    });
                    // console.log('datapushed',filteredTotals.value.map(item => item.total_deployments) );

                }

                if (showTitles.value) {
                    processedData.push({
                    label: 'Tokens Created',
                    backgroundColor: '#FDC53F',
                    data: filteredTotals.value.map(item => item.total_titleEscrowsCreated),
                    });
                }
                if (!showDeployments.value && !showTitles.value){
                    processedData.push(
                    {
                    label: 'Tokens Created',
                    backgroundColor: '#FDC53F',
                    data: filteredTotals.value.map(item => item.total_titleEscrowsCreated),
                    },
                    {
                    label: 'Token Registry Created',
                    backgroundColor: '#FF8200',
                    data: filteredTotals.value.map(item => item.total_deployments),
                    }
                );
                }
                chartData.value = {
                    labels : filteredTotals.value.map(item => item.networkName),
                    datasets: processedData
                };
                
            }else{
                chartData.value = {
                    labels: [],
                    datasets: [],
                };
            }
            loading.value = false;
        }

        const chartOptions = {
            responsive: true,
            aspectRatio:2,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
            },
            scales: {
                y: {
                ticks: {
                    color: "#b6baca",
                },
                grid: {
                    drawTicks: false,
                },
                border: {
                    dash: [5, 10],
                },
                },
                x: {
                ticks: {
                    color: "#89969f",
                },
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                },
            },
        };


        watch(
            () => props.selectedNetwork,
            () => {
                getTotals();
            },
            { immediate: true }
        );
        watch(
            () => props.dataset,
            () => {
                getTotals();
            },
            { immediate: true }
        );


        onMounted(() => {
            getTotals();
        });

        
        return{
            chartOptions,
            chartData,
            totals,
            loading,
        }

    }
}





</script>


<style scoped>
.chips{
    display: flex;
    justify-content: center;
}
/* .chart{
    display:flex;
    flex-direction: row;
} */




</style>