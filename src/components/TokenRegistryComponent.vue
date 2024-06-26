<template>
    <div class="tokenregistry" v-if="address">
        <v-card>
            <div class="header">
                <v-card-title>
                    <a style="color:black" :href="scannerUrl + address" target="_blank">{{ address}}</a>
                </v-card-title>
                <v-card-subtitle>
                    <!-- <a style="color:black" :href="scannerUrl + registry.titleEscrowFactory" target="_blank">{{ registry.titleEscrowFactory }}</a> -->
                </v-card-subtitle>
            </div>
            <v-divider></v-divider>
            <div class="content" v-if="content">
                
                <v-virtual-scroll
                    :height="200"
                    :items="content"
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
import { fetchData } from '@/utils';
import { ref, watch, onMounted } from 'vue';

export default{

    name: 'TokenRegistryComponent',
    props: {
        data: String,
        chainId: Number,
        scannerUrl:String,
    },
    data(){
        const address = this.data; 
        console.log('address',address);
        const content = ref(null);

        const params = {
            chainId: this.chainId,
            address: address,
        }

        const getTokenRegistry = async () => {
            console.log('fetching tokenRegistry');
            content.value = await fetchData('tokenRegistry', params)
            console.log(content.value);

        }

        getTokenRegistry();
        // watch(()=> this.data, (newAddress) => {
        //     address.value = newAddress;
        //     params.address = newAddress;
        //     getTokenRegistry();
        // })

        return{
            address,
            content,
            getTokenRegistry,

        }

    }

    
    
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