<template>
  <v-fab
      icon="$plus"
      class="ms-4 mb-4"
      location="bottom center"
      size="64"
      fixed
      app
  color="rgb(45,53,64)">
  </v-fab>
</template>

<script>
export default {
  name: "FixedButton"
}
</script>

<style scoped>
.btn__fix{
  position: fixed;
  right: 30px;
  top: 50%;
}
</style>