<template>
  <FixedButton @click="openToolTip"/>
  <v-navigation-drawer
    v-model="drawel"
    location="right"
    temporary
  >
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account-plus" title="Добавить" @click="openAddWindow"></v-list-item>
      <v-list-item prepend-icon="mdi-plus-box-multiple" title="Импорт csv" @click="openImportWindow"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <ExportCsvForm ref="exportForm" @export="exportSubmit"/>
</template>

<script>
import FixedButton from "@/components/UI/FixedButton";
import ExportCsvForm from "@/components/Forms/ExportCsvForm";
export default {
  name: "UserTool",
  components: {ExportCsvForm, FixedButton},
  data(){
    return{
      drawel: false
    }
  },
  methods: {
    openToolTip() {
      this.drawel = true
    },
    openImportWindow(){
      this.$refs.exportForm.dialog = true
    },
    close(){
      this.drawel = false
      this.$refs.exportForm.clearForm()
    },
    exportSubmit(file){
      this.$emit('export', file)
    },
    openAddWindow(){
      this.$emit('addUser')
    }
  }
}
</script>

<style scoped>

</style>