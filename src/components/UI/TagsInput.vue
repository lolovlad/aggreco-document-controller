<template>
  <div class="chips chips-autocomplete chips-initial" ref="chips"></div>
</template>

<script>
import M from "materialize-css"
export default {
  name: "TagsInput",
  data(){
    return{
      target: null,
      data: []
    }
  },
  methods: {
    editAutocomplete(){
      console.log("Autocomplete")
      this.target.autocomplete.updateData({
        "lol": null
      })
    }
  },
  mounted() {
    this.target = M.Chips.init(this.$refs.chips, {
      data: this.data,
      autocompleteOptions: {
        data: {
          'Apple': null,
          'Microsoft': null,
          'Google': null
        },
        limit: Infinity,
        minLength: 1,
        onAutocomplete: ()=>{
          console.log(111)
        }
      }
    })
  }
}
</script>

<style scoped>

</style>