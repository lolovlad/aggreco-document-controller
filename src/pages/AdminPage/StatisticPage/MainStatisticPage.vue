<template>
  <v-navigation-drawer
      location="right"
      permanent
  >
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Общая информация" value="Общая информация" @click="mainPage"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="По объектам" value="По объектам" @click="objectPage"></v-list-item>
      <v-list-item prepend-icon="mdi-download" title="Экспорт" value="Экспорт" @click="exportPage"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <router-view>

  </router-view>
  
  <ExportStatisticDialog v-model="exportDialog" />
</template>

<script>
import router from "@/router/router";
import ExportStatisticDialog from "@/components/Forms/Search/ExportStatisticDialog.vue";

export default {
  name: "MainStatisticPage",
  components: {
    ExportStatisticDialog
  },
  data() {
    return {
      exportDialog: false
    }
  },
  methods: {
    mainPage(){
      router.push('/admin/statistic/')
    },
    objectPage(){
      router.push('/admin/statistic/object')
    },
    exportPage(){
      this.exportDialog = true;
    }
  }
}
</script>

<style scoped>

</style>