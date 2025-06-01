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
            this.load = true
            this.$store.dispatch('auth/saveUser', {user: this.user})
          }
      )
    },
    updateUser(user){
      UserService.updateProfileUser(user.uuid, user)
          .then(() => {
            this.getProfile()
            this.message = "Успешно сохранено"
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
      v-if="load"
      :type-user-form="'worker'"
  />
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>