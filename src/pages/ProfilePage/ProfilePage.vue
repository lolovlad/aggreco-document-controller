<script>
import UserService from "@/store/user.service";
import router from "@/router/router";

export default {
  name: "ProfilePage",
  data(){
    return{
      user: null
    }
  },
  methods: {
    getProfile(){
      UserService.getProfile().then(
          user => {
            this.user = user;
          }
      )
    },
    openEditForm(){
      router.push(`/profile/account`)
    },
    openSigForm(){
      router.push(`/profile/signature`)
    }
  },
  mounted() {
    this.getProfile()
  },
  computed: {
    fullName(){
      if(this.user === null)
        return `Неизветно`
      if(this.user.name !== undefined){
        return `${this.user.surname} ${this.user.name[0]}. ${this.user.patronymic[0]}.`
      }
      return `Неизветно`
    },
    prof(){
      if(this.user === null)
        return `Неизветно`
      if(this.user.profession !== null){
        return `${this.user.profession.description}`
      }
      return "Неизветно"
    }
  }
}
</script>

<template>
  <v-navigation-drawer
      expand-on-hover
      rail
  >
    <v-list>
      <v-list-item
          prepend-avatar="account-icon-33.png"
          :subtitle=prof
          :title=fullName
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account" title="Данные аккаунта" @click="openEditForm"></v-list-item>
      <v-list-item prepend-icon="mdi-border-color" title="Добавить подпись" @click="openSigForm"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container>
    <router-view>

    </router-view>
  </v-container>
</template>

<style scoped>

</style>