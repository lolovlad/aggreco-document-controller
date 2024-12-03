<script>
import UserService from "@/store/user.service";

export default {
  name: "ViewAccountPage",
  data(){
    return{
      user: null,
      load: false
    }
  },
  methods: {
    getProfile(){
      UserService.getProfile().then(
          user => {
            console.log(user)
            this.user = user
            this.load = true
          }
      )
    },
  },
  computed: {
    prof(){
      if(this.user === null)
        return `Неизветно`
      if(this.user.profession !== null){
        return `${this.user.profession.description}`
      }
      return "Неизветно"
    }
  },
  mounted() {
    this.getProfile()
  }
}
</script>

<template>
  <v-row v-if="load">
    <v-col cols="12" md="12">
      <v-card
          class="mx-auto"
          :subtitle="prof"
      >
        <template v-slot:title>
          <span class="font-weight-black">{{user.surname}} {{user.name}} {{user.patronymic}}</span>
        </template>
        <v-card-text>
          <v-list lines="one">
            <v-list-item title="Почта" :subtitle="user.email"/>
            <v-list-item title="Права доступа" :subtitle="user.type.name"/>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>