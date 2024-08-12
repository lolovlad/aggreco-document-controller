<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card>
      <v-toolbar>
        <v-btn
            icon="mdi-close"
            @click="clearForm"
        ></v-btn>
        <v-toolbar-title>Форма документа</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn
              text="Сохранить"
              variant="text"
              @click="clickSubmit"
          ></v-btn>
        </v-toolbar-items>

      </v-toolbar>

      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-alert
                density="compact"
                :text="error"
                title="Ошибка формата документов"
                type="warning"
                v-if="error !== null"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <v-form @submit.prevent>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="document.name"
                    label="Название"
                    variant="underlined"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                      v-model="document.description"
                      variant="underlined"
                      label="Описание"
                      auto-grow
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                      v-model="document.url_document"
                      label="URL ссылка"
                      variant="underlined"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-container>

    </v-card>
  </v-dialog>

</template>

<script>
import DocumentService from "@/store/document.service";

export default {
  name: "FormDocument",
  data(){
    return{
      dialog: false,
      document: {
        uuid: null,
        name: null,
        description: null,
        url_document: null
      },

      defaultDocument: {
        uuid: null,
        name: null,
        description: null,
        url_document: null
      },

      editedUuid: null,
      error: null
    }
  },
  mounted() {
  },
  methods: {
    clickSubmit(){
      if(this.editedUuid === null){
        DocumentService.addDocument(this.document)
            .then(()=>{
              this.$emit("addDocument", this.document)
              this.clearForm()
            })
            .catch((request) => {
              this.error = request.response.data.message
            })
      }else{
        DocumentService.updateDocument(this.document)
            .then(()=>{
              this.$emit("editDocument")
              this.clearForm()
            })
            .catch((request) => {
              this.error = request.response.data.message
            })
      }
    },
    clearForm(){
      this.dialog = false
      Object.assign(this.document, this.defaultDocument)
      this.editedUuid = null
    },
    openForm(uuid){
      DocumentService.getDocumentByUuid(uuid)
          .then((response) => {
            this.document.uuid = uuid
            this.editedUuid = uuid


            this.document.url_document = response.data.url_document
            this.document.description = response.data.description
            this.document.name = response.data.name
            this.$nextTick(()=>{
              this.dialog = true
            })
          })
          .catch((response) => {
            console.log(response.response.data.message)
          })
    }
  }
}
</script>

<style scoped>

</style>