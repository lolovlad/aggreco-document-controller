<script>
import UserService from "@/store/user.service";
import EditAccountForm from "@/components/Forms/EditAccountForm.vue";

export default {
  name: "EditAccountPage",
  components: {EditAccountForm},
  data(){
    return{
      user: null,
      load: false,
      error: null,
      snackbar: false,
      message: ""
    }
  },
  methods: {
    getProfile(){
      UserService.getProfile().then(
          user => {
            this.user = user
            console.log(this.user)
            this.load = true
          }
      )
    },
    updateUser(user){
      UserService.updateUser(user.uuid, user)
          .then(() => {
            this.getProfile()
            this.message = "Успешно ссохранено"
            this.snackbar = true
          })
          .catch((response) => {
            this.error = response.data.message
          })
    }
  },
  mounted() {
    this.getProfile()
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-alert
          density="compact"
          :text="error"
          title="Ошибка"
          type="warning"
          v-if="error !== null"
      />
    </v-col>
  </v-row>
  <EditAccountForm
      :idUser="user.uuid"
      @updateUser="updateUser"
      v-if="load"/>
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>