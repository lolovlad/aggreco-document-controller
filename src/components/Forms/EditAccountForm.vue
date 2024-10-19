<script>
import ButtonAgrea from "@/components/UI/ButtonAgrea.vue";
import UserService from "@/store/user.service";

export default {
  name: "EditAccountForm",
  components: {ButtonAgrea},
  props: {
    idUser: {
      type: String,
      default: null
    }
  },
  data(){
    return{
      user: {
        email: null,
        id_type: 1,
        id_profession: 1,
        name: null,
        surname: null,
        patronymic: null,
        password: null
      },
      userScheme: {
        email: null,
        id_type: 1,
        id_profession: 1,
        name: null,
        surname: null,
        patronymic: null,
        password: null
      },
      typeUser: [],
      profUser: []
    }
  },
  methods: {
    loadType(){
      UserService.loadTypeUser()
          .then(
              (userType) => {
                this.typeUser = userType
              }
          )
    },

    loadProf(){
      UserService.getProfUser()
          .then(
              (profUSer) => {
                this.profUser = profUSer
              }
          )
    },

    getUser(){
      UserService.getUserByUuid(this.idUser)
          .then((user) => {
            Object.assign(this.user, user)
          })
    },

    clearForm(){
      Object.assign(this.user, this.userScheme)
    },

    addUser(){
      this.$emit("addUser", this.user)
    },
    updateUser(){
      this.$emit("updateUser", this.user)
    },

  },
  mounted() {
    this.loadType()
    this.loadProf()
    this.getUser()
  }
}
</script>

<template>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
            type="text"
            v-model="user.surname"
            label="Фамилия"
            variant="underlined"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            type="text"
            v-model="user.name"
            label="Имя"
            variant="underlined"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            type="text"
            v-model="user.patronymic"
            label="Отчество"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="email"
            v-model="user.email"
            label="Почта"
            variant="underlined"
            disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
            v-model="user.id_type"
            :items="typeUser"
            item-title="name"
            item-value="id"
            label="Тип пользователя"
            variant="underlined"
            disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
            v-model="user.id_profession"
            :items="profUser"
            item-title="description"
            item-value="id"
            label="Должность"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="password"
            v-model="user.password"
            label="Пароль"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <ButtonAgrea @click="updateUser">Обновить</ButtonAgrea>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>

</style>