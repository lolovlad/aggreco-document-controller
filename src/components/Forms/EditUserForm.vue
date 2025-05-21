<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
            type="text"
            v-model="user.surname"
            label="Фамилия *"
            variant="underlined"
            :rules="surnameRule"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            type="text"
            v-model="user.name"
            label="Имя *"
            variant="underlined"
            :rules="nameRule"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
            type="text"
            v-model="user.patronymic"
            label="Отчество *"
            variant="underlined"
            :rules="patronymicRule"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="email"
            v-model="user.email"
            label="Почта *"
            variant="underlined"
            :rules="emailRule"
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
            label="Тип пользователя *"
            variant="underlined"
            required
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
            label="Должность *"
            variant="underlined"
            required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <password-field
            v-if="addMode"
            v-model="user.password"
            :label="'Пароль *'"
            :rules="passwordAddRule"
        />
        <password-field
            v-else
            v-model="user.password"
            :label="'Пароль *'"
            :rules="passwordUpdateRule"
        />
      </v-col>
      <v-col cols="12" md="12">
        <small class="text-caption text-medium-emphasis">* - Поле обязательное</small>
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
import EnvService from "@/store/env.service";
import PasswordField from "@/components/UI/Fields/PasswordField.vue";
export default {
  name: "EditUserForm",
  components: {PasswordField, ButtonAgrea},
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
      profUser: [],
      surnameRule: [
        v => !!v || 'Фамилия не заполнена',
        v => /^[а-яА-ЯёЁ\s-]{2,20}$/.test(v) || 'Фамилия может содержать только русские символы и длинной от 2 до 21 символа'
      ],
      nameRule: [
        v => !!v || 'Имя не заполнена',
        v => /^[а-яА-ЯёЁ\s-]{2,20}$/.test(v) || 'Имя может содержать только русские символы и длинной от 2 до 21 символа'
      ],
      patronymicRule: [
        v => !!v || 'Отчество не заполнена',
        v => /^[а-яА-ЯёЁ\s-]{2,20}$/.test(v) || 'Отчество может содержать только русские символы и длинной от 2 до 21 символа'
      ],
      emailRule: [
          v => !!v || 'Почта обязательна',
          v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Неверная почта',
      ],
      passwordAddRule: [
        v => !!v || 'Пароль обязателен',
        v => /^.{4,32}$/.test(v) || 'Длина от 4 до 32 символов',
        v => /[a-z]/.test(v) || 'Хотя бы одна строчная буква',
        v => /[A-Z]/.test(v) || 'Хотя бы одна заглавная буква',
        v => /\d/.test(v) || 'Хотя бы одна цифра',
        v => /[!@#$%^&*]/.test(v) || 'Хотя бы один специальный символ'
      ],
      passwordUpdateRule: [
        v => (!v || /^.{4,32}$/.test(v)) || 'Длина от 4 до 32 символов',
        v => (!v || /[a-z]/.test(v)) || 'Хотя бы одна строчная буква',
        v => (!v || /[A-Z]/.test(v)) || 'Хотя бы одна заглавная буква',
        v => (!v || /\d/.test(v)) || 'Хотя бы одна цифра',
        v => (!v || /[!@#$%^&*]/.test(v)) || 'Хотя бы один специальный символ'
      ]
    }
  },
  methods: {
    loadType(){
      EnvService.loadTypeUser()
          .then(
          (userType) => {
            this.typeUser = userType
          }
      )
    },

    loadProf(){
      EnvService.getProfUser()
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

    async addUser(){
      const valid = await this.$refs.form.validate()
      if(valid.valid)
        this.$emit("addUser", this.user)
    },
    async updateUser(){
      const valid = await this.$refs.form.validate()
      if(valid.valid)
        this.$emit("updateUser", this.user)
    },

  },
  mounted() {
    this.loadType()
    this.loadProf()
    if(this.addMode === false){
      this.getUser()
    }
  }
}
</script>

<style scoped>

</style>