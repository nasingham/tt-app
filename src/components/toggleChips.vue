<template>
    <v-chip-group v-model="showNetworks" multiple>
        <v-chip filter :value="value1" variant="flat" :color="color1" :text="text1" size="small" light></v-chip>
        <v-chip filter :value="value2" variant="flat" :color="color2" :text="text2" size="small" light></v-chip>
    </v-chip-group>

</template>


<script>
import { ref, watchEffect } from 'vue';

export default{
    name:'toggleChips',
    props:{
        value1: String,
        value2 : String,
        text1 : String,
        text2 : String,
        color1 : String,
        color2: String,
    },

    data(){

        const showNetworks = ref(null);

        watchEffect(()=>{
            this.$emit('toggled',showNetworks.value);
        })

        return{
            showNetworks,
        }
    }
}



</script>


<style scoped>




</style>