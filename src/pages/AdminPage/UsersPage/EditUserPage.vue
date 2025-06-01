<template>
  <v-container>
    <button-back/>
    <v-row>
      <v-col cols="12" md="12">
        <EditUserForm
            :add-mode="addMode"
            :id-user="idUser"
            @addUser="addUser"
            @updateUser="updateUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EditUserForm from "@/components/Forms/EditUserForm.vue";
import UserService from "@/store/user.service";
import ButtonBack from "@/components/UI/ButtonBack.vue";
export default {
  name: "EditUserPage",
  components: {ButtonBack, EditUserForm},
  data(){
    return{
      idUser: this.$route.params.uuid,
      addMode: (this.$route.params.uuid === undefined),
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