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
            label="Фамилия"
            variant="underlined"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            type="text"
            v-model="user.patronymic"
            label="Фамилия"
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
      <v-col cols="12" md="4" v-if="addMode">
        <ButtonAgrea @click="addUser">Сохранить</ButtonAgrea>
      </v-col>
      <v-col cols="12" md="4" v-else>
        <ButtonAgrea @click="updateUser">Обновить</ButtonAgrea>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import ButtonAgrea from "@/components/UI/ButtonAgrea";
import UserService from "@/store/user.service";
export default {
  name: "EditUserForm",
  components: {ButtonAgrea},
  props: {
    addMode: {
      type: Boolean,
      default: true
    },
    idUser: {
      type: String,
      default: null
    }
  },
  data(){
    return{
      user: {
        email: null,
        id_type: null,
        name: null,
        surname: null,
        patronymic: null,
        password: null
      },
      typeUser: []
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

    getUser(){
      UserService.getUserByUuid(this.idUser)
          .then((user) => {
            this.user.email = user.email
            this.user.id_type = user.id_type
            this.user.name = user.name
            this.user.surname = user.surname
            this.user.patronymic = user
            this.user.password = null
          })
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
    if(this.addMode === false){
      this.getUser()
    }
  }
}
</script>

<style scoped>

</style>