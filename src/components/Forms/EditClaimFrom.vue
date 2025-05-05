<script>
import ClaimService from "@/store/claim.service";
import axios from "axios";
import MainFileUploader from "@/components/UI/MainFileUploader.vue";
import FileGeneratorForm from "@/components/Forms/FileGeneratorForm.vue";

export default {
  name: "EditClaimFrom",
  components: {FileGeneratorForm, MainFileUploader},
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
      <v-col cols="12" sm="2">
        <a :href="mainFileClaimRef">Скачать главный файл</a>
      </v-col>
      <v-col cols="12" sm="3" v-if="!readOnly">
        <MainFileUploader :type-file-upload="'main'" :uuid-claim="uuidClaim"/>
      </v-col>
      <v-col cols="12" sm="3" v-if="!readOnly">
        <FileGeneratorForm :id-claim="uuidClaim"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="2">
        <a :href="editFileClaimRef">Скачать файл с правками</a>
      </v-col>
      <v-col cols="12" sm="10" v-if="(isUser === false) && !readOnly">
        <MainFileUploader :type-file-upload="'edit'" :uuid-claim="uuidClaim"/>
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