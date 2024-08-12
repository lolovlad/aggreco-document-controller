<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <FixedButton @click="this.$refs.formDocument.dialog = true"/>


        <form-document
            @addDocument="addDocument"
            @editDocument="updateDocument"
            ref="formDocument"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <CustomDocumentTable @getUrl="getUrlDocument"
                             @deleteDoc="deleteDoc"
                             @updateDoc="updateDocView"
                             ref="documentTable"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<script>
import CustomDocumentTable from "@/components/Tabels/CustomDocumentTable";
import FormDocument from "@/components/Forms/FormDocument";
import FixedButton from "@/components/UI/FixedButton";
import documentService from "@/store/document.service";

export default {
  name: "AdminDocumentPage",
  components: {FixedButton, FormDocument, CustomDocumentTable},
  data(){
    return{
      numPage: 1,
      currentPage: 1,
      countItem: 1,
      targetDocument:{
        uuid: "",
        name: "",
        description: "",
        url_document: ""
      },
      message: null,
      snackbar: false
    }
  },
  methods:{
    addDocument(){
      this.$refs.documentTable.loadItem(1)
    },
    getUrlDocument(uuid){
      documentService.getUrlDocument(uuid)
          .then((url) => {
            navigator.clipboard.writeText(url)
                .then(()=>{
                  this.message = 'ссылка скопирована в буфер обмена'
                  this.snackbar = true
                })
          })

    },
    deleteDoc(uuid){
      documentService.deleteDocument(uuid)
          .then((response) => {
            this.message = response.data.message
            this.snackbar = true
            this.$refs.documentTable.loadItem(1)

          })
          .catch((e) => {
            this.message = e.request.data.message
          })
    },
    updateDocView(uuid){
      this.$refs.formDocument.openForm(uuid)
    },
    updateDocument(){
      this.$refs.documentTable.loadItem(1)
    }
  }
}
</script>

<style scoped>

</style>