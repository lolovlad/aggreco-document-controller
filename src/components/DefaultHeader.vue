<template>

  <v-app-bar :elevation="2">
    <v-app-bar-title @click="$router.push('/')" class="text-white">agk-work-tool</v-app-bar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "DefaultHeader"
}
</script>

<style scoped>
.text-white {
  color: white !important;
}
</style>