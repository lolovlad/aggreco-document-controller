<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <CustomUserTable :users="users"/>
      </v-col>
    </v-row>
    <UserTool ref="userTool" @export="exportUsers" @addUser="addUser"></UserTool>
    <v-snackbar
        :timeout="4000"
        v-model="snackbar"
    >
      {{error}}
    </v-snackbar>
  </v-container>
</template>

<script>
import UserService from "@/store/user.service";
import CustomUserTable from "@/components/Tabels/CustomUserTable";
import UserTool from "@/components/UserTool";
export default {
  name: "AdminUserPage",
  components: {UserTool, CustomUserTable},
  data(){
    return{
      numPage: 1,
      currentPage: 1,
      countItem: 20,
      users: [],
      snackbar: false,
      error: ""
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
      ).catch(
          (request) => {
            this.snackbar = true
            this.error = request.response.data.message
          }
      )
    },
    addUser(){
      this.$refs.userTool.close()
      this.$router.push(`/admin/user/add`)
    }
  }

}
</script>

<style scoped>

</style>