<script>
import FileDocumentService from "@/store/fileDocument.service";

export default {
  name: "UploadBlueprintForm",
  props: ["addMode", "idBlueprint"],
  data: () => ({
    dialog: false,
    fileDocument: null,
    name: null,
    snackbar: false,
    message: ""
  }),
  methods: {

    saveFileDoc() {
      let form = new FormData()
      form.append("file", this.fileDocument)
      form.append("name_file", this.name)
      if (this.fileDocument !== null) {
        FileDocumentService.saveFile(form).then(() => {
          this.snackbar = true
          this.message = "Файл сохранен"
          this.$emit("fileUpload")
        }).catch((e) => {
          console.log(e)
        });
      }
    },

    updateFile(){
      let form = new FormData()
      if (this.fileDocument !== null)
        form.append("file", this.fileDocument)
      form.append("name_file", this.name)
      FileDocumentService.updateFile(this.idBlueprint, form).then(() => {
        this.snackbar = true
        this.message = "Информация обнавлена"
        this.$emit("fileUpload")
      }).catch((e) => {
        console.log(e)
      })
    },

    getFile(){
      FileDocumentService.getFile(this.idBlueprint).then(
          (metadata) => {
            this.name = metadata.name
          }
      )
    }
  },
  mounted() {
    if(!this.addMode){
      this.getFile()
    }
  }
}
</script>

<template>
    <v-card
        prepend-icon="mdi-account"
    >
      <v-card-title v-if="addMode">Загрузка шаблона</v-card-title>
      <v-card-title v-else>Обновить шаблон</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
                type="text"
                v-model="name"
                label="Название файла *"
                variant="underlined"
                accept="*"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
              cols="12"
              md="12"
          >
            <v-file-input
                v-model="fileDocument"
                label="Шаблон документа *"
                accept="*"
                prepend-icon="mdi-border-color"
                show-size
            ></v-file-input>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*Поле обязательное</small>
      </v-card-text>

      <v-divider/>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="addMode"
            color="primary"
            text="Сохранить"
            variant="tonal"
            @click="saveFileDoc"
        ></v-btn>
        <v-btn v-else
               color="primary"
               text="Сохранить"
               variant="tonal"
               @click="updateFile"
        ></v-btn>
      </v-card-actions>
    </v-card>
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>