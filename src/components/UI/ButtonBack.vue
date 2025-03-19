<script>
export default {
  name: "ButtonBack"
}
</script>

<template>
  <v-btn
      class="back-button"
      @click="$router.back()"
      icon
  >
    <v-icon color="white">mdi-arrow-left</v-icon>
  </v-btn>
</template>

<style scoped>
.back-button {
  position: fixed;
  bottom: 16px;
  left: 16px;
  background-color: rgb(45, 53, 64);
  color: white;
  z-index: 1000;
}
</style>