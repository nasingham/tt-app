<template>
    <div class="Line">
        <v-card v-if="historyByChain" elevation="3" rounded="lg">
            <v-card-title style="background-color: #4da6e8;" class="justify-center">Token Registries Created by Network</v-card-title>
            <Line v-if="chartData"
            :options="chartOptions"
            :data="chartData">
            </Line>
            
        </v-card>





    </div>




</template>


<script>
import { computed, ref, watch, onMounted } from 'vue';
import { fetchData } from '@/utils';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Colors,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
ChartJS.register(Colors, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);



export default{


    name: 'LineChartDeployment',
    components:{
        Line,
    },
    props:{
        // data : Object,
        selectedNetwork: {
            type: Array,
            default: () => [],
        },
        days : Number,
        // network : Array,
    },
    setup(props){

        const chartData = ref(null);

        const historyByChain = ref(null);
        // console.log('history', historybyChain);
        const networks = ref([1,50,51,137,80002,101010,11155111,20180427]);
        
        
        async function getDeploymentHistory() {

            const networks = props.selectedNetwork.length ? props.selectedNetwork : [1, 50, 51, 137, 80002, 101010, 11155111, 20180427];

            historyByChain.value = await fetchData('historyDeployments', {
                days:props.days,
                chainId:networks
            })
            // console.log('historybyChain',historyByChain.value);
            if (historyByChain){
                const chains = [...new Set(historyByChain.value.map(item => item.chainId))];
                const labels = [...new Set(historyByChain.value.map(item => item.date_only.slice(0, 10)))];
                const dataset = [];
                chains.forEach(chainId => {
                    const chainData = historyByChain.value.filter(item => item.chainId === chainId);
                    dataset.push({
                    label: `Deployments - Chain ${chainId}`,
                    backgroundColor: '#FF8200',
                    borderColor: '#FF8200',
                    data: labels.map(date => {
                        const item = chainData.find(d => d.date_only.slice(0, 10) === date);
                        return item ? item.num_deployments : 0;
                    }),
                    tension: 0.3,
                    pointRadius: 0,
                    })
                });
                chartData.value= {
                    labels : labels,
                    datasets : dataset
                }
                

            }else{
            chartData.value = {
                labels: [],
                datasets: [],
            };
            

        }
        }

        

        let filteredHistory = historyByChain;
        // console.log('filtered',historybyChain);

        const chartOptions = {
            responsive: true,
            aspectRatio: 1,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
                colors:{
                    forceOverride:true,
                }
            },
            interaction: {
                intersect: false,
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
                getDeploymentHistory();
            },
            { immediate: true }
        );

        watch(
            () => props.days,
            () => {
                getDeploymentHistory();
            },
            { immediate: true }
        );

        onMounted(() => {
            getDeploymentHistory();
            // updateChartData();
        });

        
        return{
            chartOptions,
            chartData,
            historyByChain,
            // networks,
            // selectedNetwork,
        }

        }

    }

            
    

           





</script>


<style scoped>
.chips{
    display: flex;
    justify-content: center;
}




</style>