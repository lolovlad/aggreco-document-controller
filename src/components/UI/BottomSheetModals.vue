<template>
  <div class="modal bottom-sheet" ref="modelWindow">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  name: "BottomSheetModals",
  data(){
    return{
      modelInstance: null
    }
  },
  mounted() {
    const elem = this.$refs.modelWindow;
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