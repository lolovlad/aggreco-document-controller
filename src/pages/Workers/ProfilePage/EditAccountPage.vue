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
  <EditAccountForm
      :idUser="user.uuid"
      @updateUser="updateUser"
      v-if="load"
      :type-user-form="user.type.name"
  />
</template>

<style scoped>

</style>