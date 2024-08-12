<template>
  <v-app-bar color="orange-darken-3"
             prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title @click="$route.push('/')">Aggreco-work-tool</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer
      v-model="drawer"
      temporary
  >
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account" title="Пользователи" @click="userPage"/>
      <v-list-item prepend-icon="mdi-file-outline" title="Документы" @click="documentPage"/>
      <v-list-item prepend-icon="mdi-bank-outline" title="Объеты" @click="objectPage"/>
      <v-list-item prepend-icon="mdi-file-alert" title="АО" @click="accidentPage"/>
    </v-list>
    <v-divider></v-divider>
    <template v-slot:append>
      <div class="pa-2">
        <ButtonAgrea block>Выйти</ButtonAgrea>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import router from "@/router/router";
import ButtonAgrea from "@/components/UI/ButtonAgrea";

export default {
  name: "CustomAdminHeader",
  components: {ButtonAgrea},
  data(){
    return{
      drawer: false,
    }
  },
  methods:{
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
    }
  }
}
</script>

<style scoped>

</style>