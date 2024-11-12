<script>
import router from "@/router/router";

export default {
  name: "WorkerHeader",
  data(){
    return{
      drawer: false,

      fav: true,
      menu: false,
      message: false,
      hints: true,
    }
  },
  methods:{
    profilePageOpen(){
      router.push(`/profile`)
    },
    objectPage(){
      router.push('/worker/object')
    },
    accidentPage(){
      router.push('/worker/accident')
    },
    claimPage(){
      router.push('/worker/claim')
    },
    logout(){
      this.$store.dispatch('auth/logout')
      router.push('/')
    }
  },
  computed: {
    fullName(){
      const user = this.$store.state.auth.user
      if(user === null)
        return `Неизветно`
      if(user.name !== undefined){
        return `${user.surname} ${user.name[0]}. ${user.patronymic[0]}.`
      }
      return `Неизветно`
    },
    prof(){
      const user = this.$store.state.auth.user
      if(user === null)
        return `Неизветно`
      if(user.profession !== null){
        return `${user.profession.description}`
      }
      return "Неизветно"
    }
  }
}
</script>

<template>
  <v-app-bar color="orange-darken-3"
             prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title @click="$route.push('/')">Aggreco-work-tool</v-app-bar-title>
    <template v-slot:append>
      <v-menu
          v-model="menu"
          :close-on-content-click="false"
          location="end"
      >
        <template v-slot:activator="{ props }">
          <v-btn
              color="white"
              v-bind="props"
          >
            Аккаунт
          </v-btn>
        </template>

        <v-card min-width="300">
          <v-list>
            <v-list-item
                prepend-avatar="/account-icon-33.png"
                :subtitle="prof"
                :title="fullName"
            >
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item prepend-icon="mdi-cogs" title="Настройки" @click="profilePageOpen"/>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                variant="text"
                @click="menu = false"
            >
              Закрыть
            </v-btn>
            <v-btn
                color="primary"
                variant="text"
                @click="logout"
            >
              Выйти из аккаунта
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
  <v-navigation-drawer
      v-model="drawer"
      temporary
  >
    <v-list density="compact" nav>
      <!--<v-list-item prepend-icon="mdi-bank-outline" title="Объеты" @click="objectPage"/>-->
      <v-list-item prepend-icon="mdi-file-alert" title="АО" @click="accidentPage"/>
      <v-list-item prepend-icon="mdi-file-alert" title="Заявки" @click="claimPage"/>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>