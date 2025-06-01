<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-file-export-outline"
          text="Экспортировать"
          variant="tonal"
          v-bind="activatorProps"
      ></v-btn>
    </template>
    <v-card>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-file-input label="Файл csv" variant="underlined" v-model="file" accept=".csv"/>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            text="Закрыть"
            variant="plain"
            @click="clearForm"
        ></v-btn>

        <v-btn
            color="primary"
            text="Сохранить"
            variant="tonal"
            @click="clickSubmit"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ExportCsvForm",
  data(){
    return{
      file: null,
      dialog: false
    }
  },
  methods: {
    clearForm(){
      this.file = null
      this.dialog = false
    },
    clickSubmit(){
      this.$emit("export", this.file)
    }
  }
}
</script>

<style scoped>

</style>