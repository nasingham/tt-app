<template>
    <div class="Bar">
        <v-card v-if="totals" elevation="3" rounded="lg">
            <v-card-title style="background-color: #4da6e8;" class="justify-center">Deployments and Title Escrows by Network</v-card-title>
            <div class="chips">
                <v-chip-group column>
                    <ToggleChips value1="testnet" value2="mainnet" text1="Testnet" text2="Mainnet" color1="blue" color2="green" @toggled="handleNetworks"/>
                    <ToggleChips value1="deployments" value2="titles" text1="Deployments" text2="TitleEscrowsCreated" color1="orange" color2="yellow" @toggled="handleFilter"/>
                </v-chip-group>
            </div>
            <Bar
            :options="chartOptions"
            :data="chartData">
            </Bar>
            
        </v-card>





    </div>




</template>


<script>
import { computed, ref, watchEffect } from 'vue';
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
        network : Array,
    },
    data(){

        const chosenNetwork = ref(null);

        

        const totals = this.data;

        console.log('totals',totals);

        const networks = ref(null);
        const filter = ref(null);
        const showDeployments = ref(true);
        const showTitles = ref(true);

        const chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                },
            },
        };

        

        watchEffect(()=>{
            chosenNetwork.value = this.network;
            console.log('update' , chosenNetwork.value)
        })

        
        const handleNetworks = (showNetworks) => {
             networks.value = showNetworks;
        }
        const handleFilter = (filtered) => {
            filter.value=filtered;
            console.log('filters', filter.value)
            if (filter.value){
            showDeployments.value = filter.value.includes('deployments');
            console.log('showD',showDeployments.value);
            showTitles.value = filter.value.includes('titles');
            }
        }


        const chartData = computed(() => {
            if (!totals) {
                return {
                labels: [],
                datasets: [],
                };
            }

            // Filter totals based on selected networks
            let filteredTotals = totals;
            if (networks.value && networks.value.length > 0) {
                filteredTotals = filteredTotals.filter(item => networks.value.includes(item.network_type));
            }
            if (chosenNetwork.value){
                filteredTotals = filteredTotals.filter(item => chosenNetwork.value.includes(item.chainId));
            }

            const datasets = [];
            

            if (showDeployments.value) {
                datasets.push({
                label: 'Total Deployments',
                backgroundColor: '#FF8200',
                data: filteredTotals.map(item => item.total_deployments),
                });
            }

            if (showTitles.value) {
                datasets.push({
                label: 'Total Title Escrows Created',
                backgroundColor: '#FDC53F',
                data: filteredTotals.map(item => item.total_titleEscrowsCreated),
                });
            }
            if (!showDeployments.value && !showTitles.value){
                datasets.push({
                label: 'Total Title Escrows Created',
                backgroundColor: '#FDC53F',
                data: filteredTotals.map(item => item.total_titleEscrowsCreated),
                },
                {
                label: 'Total Deployments',
                backgroundColor: '#FF8200',
                data: filteredTotals.map(item => item.total_deployments),
                }
            );

            }

            return {
                labels: filteredTotals.map(item => item.networkName),
                datasets: datasets,
            };
        });

        return{
            chartOptions,
            chartData,
            totals,
            networks,
            handleNetworks,
            handleFilter,
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