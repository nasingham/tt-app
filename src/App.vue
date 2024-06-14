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
html, body, #app {
  padding: 10px;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
}
</style>
