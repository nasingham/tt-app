<template>
    <div class="Bar">
        <v-card v-if="totals" elevation="3" rounded="lg">
            <v-card-title style="background-color: #4da6e8;" class="justify-center">Total Token Registries and Tokens Created by Network</v-card-title>
            <div class="chart">
                <Bar
                    :options="chartOptions"
                    :data="chartData">
                </Bar>
            </div>
            
            
        </v-card>





    </div>




</template>


<script>
import { onMounted, ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
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
        ToggleChips,
    },
    props:{
        data : Object,
        selectedNetwork : Array,
        dataset : Array,
    },
    setup(props){

        const chartData = ref(null);


        const totals = props.data;
        if (!totals) {
            chartData.value = {
                labels: [],
                datasets: [],
            };
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

        const updateChartData = () => {
            // Update chartData based on the new props
            console.log('updating BarChart');
            chartData.value = processChartData(props.selectedNetwork, props.dataset);
        };

        watch(
            () => [props.selectedNetwork, props.dataset],
            updateChartData,
            { immediate: true }
        );
        onMounted(() => {
            updateChartData();
        });

        function processChartData(selectedNetwork, dataset) {
            let filteredTotals = totals;
            const processedData = [];
            const showDeployments = ref(true);
            const showTitles = ref(true);

            if(selectedNetwork && selectedNetwork.length >0){
                // console.log('selected',selectedNetwork);
                filteredTotals = filteredTotals.filter(item => selectedNetwork.includes(item.chainId))
            }

            if (dataset){
                // console.log('dataset',dataset);
                showDeployments.value = dataset.includes('Token Registries Created');
                // console.log('showD',showDeployments.value);
                showTitles.value = dataset.includes('Tokens Created');
                // console.log('showT',showTitles.value);
            }

            if (showDeployments.value) {
                processedData.push({
                label: 'Token Registry Created',
                backgroundColor: '#FF8200',
                data: filteredTotals.map(item => item.total_deployments),
                });
            }

            if (showTitles.value) {
                processedData.push({
                label: 'Tokens Created',
                backgroundColor: '#FDC53F',
                data: filteredTotals.map(item => item.total_titleEscrowsCreated),
                });
            }
            if (!showDeployments.value && !showTitles.value){
                processedData.push(
                {
                label: 'Tokens Created',
                backgroundColor: '#FDC53F',
                data: filteredTotals.map(item => item.total_titleEscrowsCreated),
                },
                {
                label: 'Token Registry Created',
                backgroundColor: '#FF8200',
                data: filteredTotals.map(item => item.total_deployments),
                }
            );
            }

            return {
                labels: filteredTotals.map(item => item.networkName),
                datasets: processedData,
            };
        }
        
        return{
            chartOptions,
            chartData,
            totals,
        }

    }
}





</script>


<style scoped>
.chips{
    display: flex;
    justify-content: center;
}
.chart{
    display:flex;
    flex-direction: row;
}




</style>