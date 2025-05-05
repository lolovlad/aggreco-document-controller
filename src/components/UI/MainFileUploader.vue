<script>
import ClaimService from "@/store/claim.service";

export default {
  name: "MainFileUploader",
  props: {
    typeFileUpload: {
      type: String,
    },
    uuidClaim:{
      type: String,
    }
  },
  data(){
    return{
      dialog: false,
      fileDocument: null
    }
  },
  methods: {
    saveMainFile(){
      let form = new FormData()
      form.append("file", this.fileDocument)
      if(this.fileDocument !== null){
        ClaimService.saveFile(this.uuidClaim, this.typeFileUpload, form).then(()=>{
          this.snackbar = true
          this.message = "Файл сохранен"
          this.close()
        })
      }
    },
    close(){
      this.dialog = false
      this.fileDocument = null
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
          text="Загрузить"
          variant="tonal"
          v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card
        prepend-icon="mdi-account"
        title="Работа с документом"
    >
      <v-card-text>
        <v-row dense>
          <v-col
              cols="12"
              md="12"
          >
            <v-file-input
                v-model="fileDocument"
                label="Главный документ"
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
            @click="close"
        ></v-btn>

        <v-btn
            color="primary"
            text="Сохранить"
            variant="tonal"
            @click="saveMainFile"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>