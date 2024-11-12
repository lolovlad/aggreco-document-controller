<script>
import ClaimService from "@/store/claim.service";
import axios from "axios";
import FileDocumentService from "@/store/fileDocument.service";

export default {
  name: "EditClaimFrom",
  components: {},
  props: {
    uuidClaim: {
      type: String,
      default: null
    },
    isUser: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      mainFileClaimRef: null,
      editFileClaimRef: null,
      comment: null,
      datetime: null,

      mainFileClaim: null,
      editFileClaim: null,

      snackbar: false,
      message: "",

      fileBlueprintRef: null,
      listFileDock: []
    }
  },
  methods:{
    getClaim(){
      ClaimService.getClaims(this.uuidClaim).then((claim) => {
            this.mainFileClaimRef = `${axios.defaults.baseURL}claim/file/main/${claim.uuid}`
            this.editFileClaimRef = `${axios.defaults.baseURL}claim/file/edit/${claim.uuid}`
            this.comment = claim.comment
            this.datetime = claim.datetime
      })
    },
    getListFileDock(){
      FileDocumentService.getListFiles()
          .then((files) => {
            for(let item of files){
              this.listFileDock.push({
                name: item.file_name,
                ref: `${axios.defaults.baseURL}file/${item.id}`
              })
            }
          })
    },
    saveMainFile(){
      let form = new FormData()
      form.append("file", this.mainFileClaim)
      if(this.mainFileClaim !== null){
        ClaimService.saveFile(this.uuidClaim, "main", form).then(()=>{
          this.snackbar = true
          this.message = "Файл сохранен"
        })
      }
    },
    saveEditFile(){
      let form = new FormData()
      form.append("file", this.editFileClaim)
      if(this.editFileClaim !== null){
        ClaimService.saveFile(this.uuidClaim, "edit", form).then(()=>{
          this.snackbar = true
          this.message = "Файл сохранен"
        })
      }
    },
    saveChange(){
      ClaimService.updateClaim(this.uuidClaim, {comment: this.comment}).then(()=>{
        this.snackbar = true
        this.message = "Комментарий сохранен"
      })
    }
  },
  mounted() {
    this.getClaim()
    this.getListFileDock()
  }
}
</script>

<template>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12" sm="12">
        <v-textarea
            label="Комментарии"
            variant="underlined"
            auto-grow
            v-model="comment"
            :readonly="isUser && readOnly"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <a :href="mainFileClaimRef">Скачать главный файл</a>
      </v-col>
      <v-col cols="12" sm="10" v-if="!readOnly">
        <v-file-input
            v-model="mainFileClaim"
            label="Главный документ с подписями"
            accept="*"
            prepend-icon="mdi-border-color"
            show-size
        ></v-file-input>
      </v-col>
      <v-col cols="12" sm="2" v-if="!readOnly">
        <v-btn class="mt-4" type="submit" @click="saveMainFile">Загрузить файл</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <a :href="editFileClaimRef">Скачать файл с правками</a>
      </v-col>
      <v-col cols="12" sm="10" v-if="(isUser === false) && !readOnly">
        <v-file-input
            v-model="editFileClaim"
            label="Документ с комментариями"
            accept="*"
            prepend-icon="mdi-border-color"
            show-size
        ></v-file-input>
      </v-col>
      <v-col cols="12" sm="2" v-if="isUser === false && !readOnly">
        <v-btn class="mt-4" type="submit" @click="saveEditFile">Загрузить файл</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="12" v-if="fileBlueprintRef !== null">
        <a :href="fileBlueprintRef">Скачать Актуальный шаблон документа</a>
      </v-col>
      <v-col cols="12" sm="12">
        <v-virtual-scroll
            :items="listFileDock"
            height="320"
            item-height="48"
        >
          <template v-slot:default="{ item }">
            <a :href="item.ref">{{item.name}}</a>
          </template>
        </v-virtual-scroll>
      </v-col>
    </v-row>

    <v-btn class="mt-4" type="submit" @click="saveChange" v-if="isUser === false && !readOnly">Сохранить</v-btn>
  </v-form>
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>