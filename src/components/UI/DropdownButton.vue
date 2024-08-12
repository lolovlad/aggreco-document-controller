<template>
  <a class='dropdown-trigger btn' :data-target=dataTarget ref="buttonDropdown">{{textButton}}</a>
  <ul :id=dataTarget class='dropdown-content'>
    <slot></slot>
  </ul>
</template>

<script>
import M from 'materialize-css'
export default {
  name: "DropdownButton",
  data(){
    return{
      target: null
    }
  },
  props: {
    dataTarget: String,
    textButton: String
  },
  mounted() {
    const elems = this.$refs.buttonDropdown
    this.target = M.Dropdown.init(elems, {
      constrainWidth: false
    });
  }
}
</script>

<style scoped>

</style>