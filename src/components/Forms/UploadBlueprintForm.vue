<script>
import FileDocumentService from "@/store/fileDocument.service";

export default {
  name: "UploadBlueprintForm",
  data: () => ({
    dialog: false,
    fileDocument: null,
    snackbar: false,
    message: ""
  }),
  methods: {

    saveFileDoc() {
      let form = new FormData()
      form.append("file", this.fileDocument)
      if (this.fileDocument !== null) {
        FileDocumentService.saveFile(form).then(() => {
          this.snackbar = true
          this.message = "Файл сохранен"
          this.fileDocument = null
        }).catch((e) => {
          console.log(e)
        });
      }
    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      max-width="600"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-text-box-plus-outline"
          text="Добавить"
          variant="tonal"
          v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card
        prepend-icon="mdi-account"
        title="Должность"
    >
      <v-card-text>
        <v-row dense>
          <v-col
              cols="12"
              md="12"
          >
            <v-file-input
                v-model="fileDocument"
                label="Шаблон документа"
                accept="*"
                prepend-icon="mdi-border-color"
                show-size
            ></v-file-input>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*Поле обязательное</small>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            text="Закрыть"
            variant="plain"
            @click="dialog = false"
        ></v-btn>

        <v-btn
            color="primary"
            text="Сохранить"
            variant="tonal"
            @click="saveFileDoc"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>