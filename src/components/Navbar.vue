<template>
  <div class="nav" style="z-index:1000">
    <v-card>
      <v-layout>
        <v-navigation-drawer
          expand-on-hover
          rail 
          color='#2D5FAA'
        >
          <v-list>
              <v-list-item
                :to="{name:'home'}"
                class="icon"
                prepend-icon="mdi-earth"
                subtitle="Global search"
                title="Overview"
                
              ></v-list-item>
          </v-list>
  
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <v-list-item  :to="{name:'networkView', params: {id:1}}" class="icon" prepend-icon="mdi-rhombus" title="Ethereum Mainnet" value="eth" ></v-list-item>
            <v-list-item :to="{name:'networkView' , params: {id:11155111}}" class="icon" prepend-icon="mdi-alpha-s-circle-outline" title="Sepolia" value="sepolia" ></v-list-item>
            <v-list-item  :to="{name:'networkView', params: {id:101010}}" class="icon" prepend-icon="mdi-cube" title="Stability GTN" value="stability" ></v-list-item>
            <v-list-item  :to="{name:'networkView', params: {id:20180427}}" class="icon" prepend-icon="mdi-cube-outline" title="Stability Testnet" value="stabilityTestnet" ></v-list-item>
            <v-list-item  :to="{name:'networkView', params: {id:50}}" class="icon" prepend-icon="mdi-alpha-x-circle" title="XDC Mainnet" value="xdc" ></v-list-item>
            <v-list-item  :to="{name:'networkView', params: {id:51}}" class="icon" prepend-icon="mdi-alpha-x-circle-outline" title="XDC Apothem" value="xdcApothem" ></v-list-item>
            <v-list-item  :to="{name:'networkView', params: {id:137}}" class="icon" prepend-icon="mdi-hexagon-slice-6" title="Polygon" value="polygon" ></v-list-item>
            <v-list-item  :to="{name:'networkView', params: {id:80002}}" class="icon" prepend-icon="mdi-hexagon-outline" title="Polygon Amoy" value="amoy" ></v-list-item>
            
          </v-list>

          <v-divider></v-divider>
          <v-list density="compact" nav>
            <v-list-item class="icon" prepend-icon="mdi-webhook" title="Network Graph" value="network" ></v-list-item>
          </v-list>


        </v-navigation-drawer>
  
        
      </v-layout>
    </v-card>
  </div>
  </template>

<script>



export default{
  
    name:'Navbar',

}

</script>

<style scoped>
.nav{
  fill:aquamarine;
}
</style>