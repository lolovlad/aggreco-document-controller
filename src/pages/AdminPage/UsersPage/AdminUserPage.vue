<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <CustomUserTable
            ref="userTable"
            :users="users"
            @deleteUser="deleteUser"
            @updateUser="updateUser"/>
      </v-col>
    </v-row>
    <UserTool ref="userTool" @export="exportUsers" @addUser="addUser"></UserTool>
  </v-container>
</template>

<script>
import UserService from "@/store/user.service";
import CustomUserTable from "@/components/Tabels/CustomUserTable.vue";
import UserTool from "@/components/UserTool.vue";

export default {
  name: "AdminUserPage",
  components: {UserTool, CustomUserTable},
  data(){
    return{
      numPage: 1,
      currentPage: 1,
      countItem: 20,
      users: []
    }
  },
  methods:{
    updateUserList(page){
      this.currentPage = page
    },
    exportUsers(file){

      let form = new FormData()
      form.append("file", file)
      UserService.importFile(form).then(
          (request) => {
            if (request.status === 201)
              this.$refs.userTool.close()
          }
      )
    },
    addUser(){
      this.$refs.userTable.saveState()
      this.$refs.userTool.close()
      this.$router.push(`/admin/user/add`)
    },
    deleteUser(uuid){
      UserService.deleteUser(uuid)
          .then(()=>{
            this.$refs.userTable.loadItem(1)
          })
    },
    updateUser(uuid){
      this.$refs.userTool.close()
      this.$router.push(`/admin/user/edit/${uuid}`)
    }
  }

}
</script>

<style scoped>

</style>