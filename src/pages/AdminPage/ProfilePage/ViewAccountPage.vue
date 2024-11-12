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
            this.user = user
            this.load = true
          }
      )
    },
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
          :subtitle="user.profession.description"
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