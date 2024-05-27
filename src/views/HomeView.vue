<template>
  <div>
    <p>{{ data }}</p>
    <p>123</p>
  </div>
</template>




<script>
export default{
  data() {
    return{
      data : null,
    };
  },
  async created(){
    console.log('created')
    try{
      const response = await fetch ('/functions/listen_deployer');
      if (!response.ok){
        throw new Error('Network response not ok');
      }
      console.log(response);
      const result = await response.json();
      this.data=result;
      console.log(result);
    
    } catch (error){
      console.log(error)
      this.error = error.toString();
    }
  },
}

</script>


<style>



</style>