<template>
    <div class="tokenregistry">
        <v-card :title="registry.deployed" :subtitle="registry.titleEscrowFactory" variant="tonal">
            <v-divider></v-divider>
            <div class="content">
                <v-virtual-scroll
                    :height="200"
                    :items="registry"
                    :item-height="8"
                    :width="100"
                    >
                    <template v-slot:default="{ item }">
                        {{ item.tokenId }}
                        <v-icon>mdi-arrow-right</v-icon>
                        {{ item.titleEscrow }}
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
    },
    
}

</script>




<style>




</style>