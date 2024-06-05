  <template>
    <div class="home">
      <v-card class="summary-box">
        <v-tabs v-model="activeTab" bg-color="primary">
          <v-tab value="sepolia" >Sepolia</v-tab>
          <v-tab value="eth" >Ethereum</v-tab>
          <v-tab value="gtn" >Stability GTN</v-tab>
        </v-tabs>
        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item value="sepolia">
            <SummaryComponent
              v-if="sepoliaData"
              :data="sepoliaData"
              :timestamp="sepoliaTimestamp"
              scannerUrl="https://sepolia.etherscan.io/address/"
              :refresh = "getSepolia"
            />
          </v-tabs-window-item>
          <v-tabs-window-item value="eth">
            <SummaryComponent
              v-if="ethData"
              :data="ethData"
              :timestamp="ethTimestamp"
              scannerUrl="https://etherscan.io/address/"
              :refresh="getEth"
            />
          </v-tabs-window-item>
          <v-tabs-window-item value="gtn">
            <SummaryComponent
              v-if="stabilityData"
              :data="stabilityData"
              :timestamp="stabilityTimestamp"
              scannerUrl="https://stability.blockscout.com/address/"
              :refresh="getStability"
            />
          </v-tabs-window-item>
        </v-tabs-window>

        <v-sheet max-width="600">
          <v-slide-group show-arrows>
            <v-slide-group-item>
              <h2>test</h2>
            </v-slide-group-item>

          </v-slide-group>

        </v-sheet>
      </v-card>
  </div>
  </template>




  <script>
  import { ref, onMounted } from 'vue';
  import SummaryComponent from '../components/SummaryComponent.vue';
  import TokenRegistryComponent from '../components/TokenRegistryComponent.vue';
  import Navbar from '@/components/Navbar.vue';

  

  export default{
    name: 'HomeView',
    components:{
      SummaryComponent,
      TokenRegistryComponent,
      Navbar,
 
    },


    data() {

      const activeTab = ref(0);
      const sepoliaData = ref(null);
      const ethData = ref(null);
      const stabilityData = ref(null);
      const sepoliaTimestamp = ref(null);
      const ethTimestamp = ref(null);
      const stabilityTimestamp = ref(null);
      const error = ref(null);

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
        console.log(sepoliaTimestamp);
      };
        

      const getEth = () => {
        console.log('fetching eth')
          fetchData(
            'https://tradetrust-app.netlify.app/.netlify/functions/eth-listen_combine',
            ethData,
            ethTimestamp
          );
      };

      const getStability = () => {
        console.log('fetching stability')
          fetchData(
            'https://tradetrust-app.netlify.app/.netlify/functions/stability-listen_combine',
            stabilityData,
            stabilityTimestamp
          );
        };


      onMounted(() => {
        getSepolia(); // Load the default tab's data
        getStability();
        getEth();
      });



      return{
        activeTab,
        getSepolia,
        getEth,
        getStability,
        sepoliaData,
        ethData,
        stabilityData,
        sepoliaTimestamp,
        ethTimestamp,
        stabilityTimestamp,
        fakeData : [{
                          "deployer": "0xfcF70dd03050E295455DE2385376b920b0079C58",
                          "deployed": [
                              "0x8f6d18B240225CeF15fb2eE305E97F7c52ADc1eC",
                              {
                                  "number of tokens": 1
                              },
                              [
                                  {
                                      "tokenId": "69170160261383144995106450495134788611054042593254808028619120633882071262575",
                                      "titleEscrow": "0xb884043e8199eF768e75EC51Fdd6e51b3dFFb3f5"
                                  }
                              ]
                          ],
                          "titleEscrowFactory": "0xA38CC56c9291B9C1f52F862dd92326d352e710b8"
                      }],
      
      };
    },

    
  } 

  </script>


  <style scoped>

  .summary-box {
    border: 1px solid black;
    padding: 20px;
    margin: 20px;
    height: 600px;
    width: 1320px;
  }

  .summary {
    padding: 20px;
  }

  .uniques{
    margin-top: 10px;
    display:flex;
    padding:10px;
  }
  .unique-deployers,
  .unique-factory,
  .unique-registries {
    margin-right: 20px;
    align-items: center;
  }

  .unique-deployers h3,
  .unique-factory h3,
  .unique-registries h3 {
    margin-bottom: 5px;
  }

  .slide-group-item{
    margin-right:5px;
  }



  </style>