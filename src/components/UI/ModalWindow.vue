<template>
  <div class="modal" ref="model">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  name: "ModalWindow",
  data(){
    return{
      modelInstance: null
    }
  },
  mounted() {
    const elem = this.$refs.model;
    this.modelInstance = M.Modal.init(elem, {
      onCloseEnd: () => {this.$emit("closeUser")}
    });
  },
  methods:{
    close(){
      this.modelInstance.close()
    },
    open(){
      this.modelInstance.open()
    }
  }
}
</script>

<style scoped>

</style>