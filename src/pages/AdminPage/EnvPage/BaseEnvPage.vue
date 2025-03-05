<script>
export default {
  name: "BaseEnvPage"
}
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item title="Должность" @click="$router.push('/admin/env/profession')"></v-list-item>
      <v-list-item title="Типы оборудованния" @click="$router.push('/admin/env/type_equipment')"></v-list-item>
      <v-list-item title="Регионы" @click="$router.push('/admin/env/region')"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <router-view>

  </router-view>
</template>

<style scoped>

</style>