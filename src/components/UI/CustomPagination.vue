<template>
  <ul class="pagination">
    <li v-for="i in countPage" :key="i" class="waves-effect" :class="activePage(i)" @click="getCurPage(i)"><a>{{i}}</a></li>
  </ul>
</template>

<script>
export default {
  name: "CustomPagination",
  data(){
    return{
      curPage: 1
    }
  },
  props: {
    countPage: {
      type: Number,
      default: 1
    }
  },
  computed: {

  },
  methods: {
    getCurPage(numPage){
      this.$emit("updatePage", numPage)
      this.curPage = numPage
    },
    activePage(numPage){
      return{
        active: numPage === this.curPage
      }
    }
  }
}
</script>

<style scoped>

</style>