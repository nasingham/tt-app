<template>
<div class="summary">
    <h2>Total number of deployments: {{ data.deployments.numDeployments }}</h2>
    <h2>Total number of Title Escrows created: {{ data.numCreated }}</h2>
  
    <div class="uniques">
      <v-card  title="List of unique deployers" class="unique-deployers">
        <v-virtual-scroll :height="300" :items= data.deployments.uniqueDeployer :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
      <v-card  title="List of Title Escrow Factories" class="unique-factory">
        <v-virtual-scroll :height="300" :items= data.deployments.uniqueFactory :item-height="5" :width="400" >
          <template v-slot:default="{ item }">
            {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card>
    </div>
</div>

</template>


<script>
export default{
    name: 'SummaryComponent',
    props: {data:{ required : true}
    },
    
    data(props){
        console.log(props.data);
    }

}


</script>



<style>
.uniques{
  margin-top: 10px;
  display:flex;
  padding:10px;
}
.unique-deployers,
.unique-factory {
  margin-right: 20px;
  align-items: center;
}

.unique-deployers h3,
.unique-factory h3 {
  margin-bottom: 5px;
}



</style>