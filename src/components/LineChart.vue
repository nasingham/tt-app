<template>
    <div class="Line">
      <v-card elevation="3" rounded="lg">
        <v-card-title style="background-color: #4da6e8;" class="justify-center">
          Token Registres and Tokens Created (past {{ num_days }} days)
        </v-card-title>
        <Line
          v-if="chartData"
          :options="chartOptions"
          :data="chartData"
        />
      </v-card>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import { fetchData } from '@/utils';
  import { Line } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);
  
  export default {
    name: 'LineChart',
    components: {
      Line,
    },
    props: {
      dataset: Array,
      days: Number,
    },
    setup(props) {
      const chartData = ref(null);
      const history = ref(null);
      // const num_days = ref(3);
      const filteredHistory = ref([]);
  
      async function getHistory() {
        console.log('getting history');
        history.value = await fetchData('history', { days: props.days });
        if (history.value) {
          filteredHistory.value = history.value;
          chartData.value = {
            labels: history.value.map(item => item.date_only.slice(0, 10)),
            datasets: [
              {
                label: 'Tokens Created',
                backgroundColor: '#FDC53F',
                borderColor: '#FDC53F',
                data: history.value.map(item => item.num_tokens),
                tension: 0.3,
                pointRadius: 0,
              },
              {
                label: 'Token Registries Created',
                backgroundColor: '#FF8200',
                borderColor: '#FF8200',
                data: history.value.map(item => item.num_deployments),
                tension: 0.3,
                pointRadius: 0,
              },
            ],
          };
        } else {
          chartData.value = {
            labels: [],
            datasets: [],
          };
        }
      }
  
      const chartOptions = {
        responsive: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          y: {
            ticks: {
              color: '#b6baca',
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
              color: '#89969f',
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
        console.log('updating Linechart');
        if (filteredHistory.value && filteredHistory.value.length) {
          chartData.value = processChartData(props.dataset);
        }
      };
  
      watch(
        () => [props.dataset],
        updateChartData,
        { immediate: true }
      );

      watch(
            () => props.days,
            () => {
                getHistory();
            },
            { immediate: true }
        );
  
      onMounted(async () => {
        await getHistory();
        updateChartData();
      });
  
      function processChartData(dataset) {
        const processedData = [];
        const showDeployments = ref(true);
        const showTitles = ref(true);
  
        if (dataset) {
          showDeployments.value = dataset.includes('Token Registries Created');
          showTitles.value = dataset.includes('Tokens Created');
        }
  
        if (showDeployments.value && filteredHistory.value) {
          processedData.push({
            label: 'Token Registries Created',
            backgroundColor: '#FF8200',
            borderColor: '#FF8200',
            data: filteredHistory.value.map(item => item.num_deployments),
            tension: 0.3,
            pointRadius: 0,
          });
        }
  
        if (showTitles.value && filteredHistory.value) {
          processedData.push({
            label: 'Tokens Created',
            backgroundColor: '#FDC53F',
            borderColor: '#FDC53F',
            data: filteredHistory.value.map(item => item.num_tokens),
            tension: 0.3,
            pointRadius: 0,
          });
        }

        if (dataset.length===0){
            processedData.push({
                label: 'Tokens Created',
                backgroundColor: '#FDC53F',
                borderColor: '#FDC53F',
                data: filteredHistory.value.map(item => item.num_tokens),
                tension: 0.3,
                pointRadius: 0,
            },
            {
                label: 'Token Registries Created',
                backgroundColor: '#FF8200',
                borderColor: '#FF8200',
                data: filteredHistory.value.map(item => item.num_deployments),
                tension: 0.3,
                pointRadius: 0,
            });

        }
  
        return {
          labels: filteredHistory.value.map(item => item.date_only.slice(0, 10)),
          datasets: processedData,
        };
      }
  
      return {
        chartOptions,
        chartData,
        history,
        filteredHistory,
        // num_days,
      };
    },
  };
  </script>
  
  <style scoped>
  .chips {
    display: flex;
    justify-content: center;
  }
  </style>
  