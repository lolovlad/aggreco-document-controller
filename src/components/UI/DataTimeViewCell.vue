<template>
  <td>{{dataView}}</td>
</template>

<script>
export default {
  name: "DataTimeViewCell",
  props:{
    dataTime:{
      type: String,
    }
  },
  computed:{
    dataView(){
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(this.dataTime).toLocaleDateString('ru-RU', options)
    }
  }
}
</script>

<style scoped>

</style>