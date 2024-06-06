<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>
</template>





<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components:{
    Navbar,
  }

}
</script>

<style>
html, body {
  margin: 0;
}
#app{
  background-color: #F7F8FC;
}
</style>
