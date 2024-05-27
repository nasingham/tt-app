<template>
  <div>
    <p>{{ data }}</p>
    <p>{{ num }}</p>
  </div>
</template>




<script>
export default{
  data() {
    return{
      data : null,
      num : null,
    };
  },
  async created(){
    console.log('created')
    try{
      const response = await fetch ('https://tradetrust-app.netlify.app/.netlify/functions/listen_deployer');
      if (!response.ok){
        throw new Error('Network response not ok');
      }
      console.log(response);
      const result = await response.json();
      this.data = result.returnValues;
      this.num = result.numDeployments;
      console.log(result.numDeployments);

    
    } catch (error){
      console.log(error)
      this.error = error.toString();
    }
  },
}

</script>


<style>



</style>