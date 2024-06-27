<template>
  <v-card rounded="lg" width="30vw">
    <v-card-title style="background-color: #4da6e8;">Supported Networks</v-card-title>
    <v-data-table class="v-data-table"
      v-model="selected"
      :headers="headers"
      :items="data"
      
      return-object
      show-select
      hide-default-footer
      >
      
        <template #item.chainId="{ value }">
            <p >{{ value }} </p>
        </template>
        <template #item.networkName="{value}">
          <p >{{ value }}</p>
        </template>
        <template #item.network_type="{value}">
          <p >{{ value }}</p>
        </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { ref , watchEffect} from 'vue';

export default {
  name: 'NetworkTable',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {

    const selected = ref(null);

    watchEffect(() => {
          this.$emit('chooseNetwork', selected.value);
          console.log('selected',selected.value);
        })

    return {
      headers: [
        { title: 'Chain ID', key: 'chainId', width:'15%'},
        { title: 'Network Name', key: 'networkName', width:'30%' },
        { title: 'Network Type', key: 'network_type', width:'30%'},
      ],
      selected,
    };
  },
  computed: {
  },
  methods: {
    handleRowClick(item) {
      this.$emit('network-selected', item.chainId);
      // console.log(item.chainId);
    },
    getRowClass(item) {
      return item.network_type === 'mainnet' ? 'mainnet-row' : 'testnet-row';
    },
  },
};
</script>

<style scoped>
.mainnet-row {
  background-color: #abdfbf;   /* Light blue for mainnet */
}

.testnet-row {
  background-color:#e0f7fa; /* Light pink for testnet */
}
</style>
