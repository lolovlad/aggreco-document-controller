<template>

  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title @click="$route.push('/')">Aggreco-work-tool</v-app-bar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "DefaultHeader"
}
</script>

<style scoped>

</style>