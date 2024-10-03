<template>
  <v-navigation-drawer
      location="right"
      permanent
  >
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Общая информация" value="Общая информация" @click="mainPage"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="По объектам" value="По объектам" @click="objectPage"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <router-view>

  </router-view>
</template>

<script>
import router from "@/router/router";

export default {
  name: "MainStatisticPage",
  methods: {
    mainPage(){
      router.push('/admin/statistic/')
    },
    objectPage(){
      router.push('/admin/statistic/object')
    },
  }
}
</script>

<style scoped>

</style>