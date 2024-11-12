<template>
  <v-container>
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
    <v-row>
      <v-col cols="12" md="12">
        <EditUserForm
            :add-mode="addMode"
            :id-user="idUser"
            @addUser="addUser"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EditUserForm from "@/components/Forms/EditUserForm.vue";
import UserService from "@/store/user.service";
export default {
  name: "EditUserPage",
  components: {EditUserForm},
  data(){
    return{
      idUser: this.$route.params.uuid,
      addMode: (this.$route.params.uuid === undefined),
      error: null
    }
  },
  methods:{
    addUser(user){
      UserService.addUser(user)
          .then(() => {
            this.$router.push(`/admin/user/`)
          })
          .catch((response) => {
            this.error = response.data.message
          })

    },
    updateUser(user){
      UserService.updateUser(this.idUser, user)
          .then(() => {
            this.$router.push(`/admin/user/`)
          })
          .catch((response) => {
            this.error = response.data.message
          })
    }
  }
}
</script>

<style scoped>

</style>