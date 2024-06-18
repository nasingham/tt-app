<template>
    <div class="tokenregistry">
        <v-card >
            <div class="header">
                <v-card-title>
                    <a style="color:black" :href="scannerUrl + registry.deployed.deployed" target="_blank">{{ registry.deployed.deployed }}</a>
                </v-card-title>
                <v-card-subtitle>
                    <a style="color:black" :href="scannerUrl + registry.titleEscrowFactory" target="_blank">{{ registry.titleEscrowFactory }}</a>
                </v-card-subtitle>
            </div>
            <v-divider></v-divider>
            <div class="content">
                
                <v-virtual-scroll
                    :height="200"
                    :items="registry.deployed.contents"
                    :item-height="8"
                    :width="200"
                    >
                    <template  v-slot:default="{ item }">
                        <div class="item">
                            {{ item.tokenId.slice(0, 8) + '...' }}
                            <v-icon>mdi-arrow-right</v-icon>
                            <a :href="scannerUrl + item.titleEscrow" target="_blank">{{ item.titleEscrow.slice(0, 8) + '...' }}</a>
                        </div>
                    </template>
                </v-virtual-scroll>


            </div>


        </v-card>



    </div>


</template>



<script>

export default{
    name: 'TokenRegistryComponent',
    props: {
        registry: Object,
        scannerUrl:String,
    },
    
    
}

</script>




<style>
.tokenregistry{
    max-width:200px;
    margin-right:5px;
    font-size: small;
}

.tokenregistry .header{
    background-color: #3aaf86;
}

/* .tokenregistry .v-card{
    background-color: #e7eaec;
} */

.item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding:10px;  
}
.item a{
    /* color:blue; */
}





</style>