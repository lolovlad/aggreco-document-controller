<template>
  <v-app-bar color="orange-darken-3"
             prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title @click="$route.push('/')">Aggreko-work-tool</v-app-bar-title>
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
      <v-list-item prepend-icon="mdi-account" title="Пользователи" @click="userPage"/>
      <!--<v-list-item prepend-icon="mdi-file-outline" title="Документы" @click="documentPage"/>-->
      <v-list-item prepend-icon="mdi-bank-outline" title="Объеты" @click="objectPage"/>
      <v-list-item prepend-icon="mdi-file-alert" title="АО" @click="accidentPage"/>
      <v-list-item prepend-icon="mdi-file-alert" title="Регистрация АО" @click="claimPage"/>
      <v-list-item prepend-icon="mdi-chart-bar" title="Статистика" @click="statisticPage"/>
    </v-list>

    <template v-slot:append>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-cog-outline" title="Настройки" @click="envPage"/>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import router from "@/router/router";


export default {
  name: "CustomAdminHeader",
  components: {},
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
    userPage(){
      router.push('/admin/user')
    },
    documentPage(){
      router.push('/admin/document')
    },
    objectPage(){
      router.push('/admin/object')
    },
    accidentPage(){
      router.push('/admin/accident')
    },
    statisticPage(){
      router.push('/admin/statistic')
    },
    claimPage(){
      router.push('/admin/claim')
    },
    logout(){
      this.$store.dispatch('auth/logout')
      router.push('/')
    },
    envPage(){
      router.push('/admin/env')
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

<style scoped>

</style>