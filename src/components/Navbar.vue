<template>
    <v-card>
      <v-layout>
        <v-navigation-drawer
          expand-on-hover
          rail 
        >
          <v-list>
            <v-list-item
              class="icon"
              prepend-icon="mdi-earth"
              subtitle="Global search"
              title="Overview"
              
            ></v-list-item>
          </v-list>
  
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <v-list-item class="icon" prepend-icon="mdi-alpha-s-circle-outline" title="Sepolia" value="sepolia"></v-list-item>
            <v-list-item class="icon" prepend-icon="mdi-rhombus" title="Ethereum Mainnet" value="eth"></v-list-item>
            <v-list-item class="icon" prepend-icon="mdi-cube" title="Stability GTN" value="stability"></v-list-item>
            
          </v-list>

          <v-divider></v-divider>
          <v-list density="compact" nav>
            <v-list-item class="icon" prepend-icon="mdi-webhook" title="Network Graph" value="network"></v-list-item>
          </v-list>


        </v-navigation-drawer>
  
        
      </v-layout>
    </v-card>
  </template>

<script>


export default{
    name:'NavbarComponent',

}

</script>

<style>

</style>