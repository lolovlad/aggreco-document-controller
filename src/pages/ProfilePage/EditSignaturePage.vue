<script>
import ButtonAgrea from "@/components/UI/ButtonAgrea.vue";
import UserService from "@/store/user.service";

export default {
  name: "EditSignaturePage",
  components: {ButtonAgrea},
  data(){
    return{
      file: null,
      rules: [
        value => {
          return !value || !value.length || value[0].size < 2000000 || 'Подпись не может весить больше 2 MB!'
        },
      ],
      snackbar: false,
      message: "",
      img: null
    }
  },
  methods: {
    saveSig(){
      let form = new FormData()
      form.append("file", this.file)
      UserService.saveSignature(form).then(
          () => {
            this.snackbar = true
            this.message = "Подпись сохранена"
            this.file = null
            this.getSig()
          }
      ).catch(
          (request) => {
            this.snackbar = true
            this.error = request.response.data.message
          }
      )
    },
    getSig(){
      UserService.getSignature().then(
          (data) => {
            if (data.file !== null) {
              this.img = `data:image/${data.exp};base64, ${data.file}`
            }
          }
      ).catch(
          (request) => {
            this.snackbar = true
            this.error = request.response.data.message
          }
      )
    }
  },
  mounted() {
    this.getSig()
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-img
            :width="293"
            aspect-ratio="16/9"
            cover
            :src=img
            v-if="img !== null"
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-file-input
          :rules="rules"
          v-model="file"
          label="Подпись (изображение формата .png|.jpg)"
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-border-color"
          show-size
      ></v-file-input>
    </v-row>
    <v-row>
      <ButtonAgrea @click="saveSig">Сохранить</ButtonAgrea>
    </v-row>
  </v-container>
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>