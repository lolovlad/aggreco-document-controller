<script>
import ButtonAgrea from "@/components/UI/ButtonAgrea.vue";
import UserService from "@/store/user.service";
import EnvService from "@/store/env.service";

export default {
  name: "EditAccountForm",
  components: {ButtonAgrea},
  props: {
    idUser: {
      type: String,
      default: null
    },
    typeUserForm: {
      type: String,
      default: "admin"
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
        password: null,
        email_send_info: {}
      },
      userScheme: {
        email: null,
        id_type: 1,
        id_profession: 1,
        name: null,
        surname: null,
        patronymic: null,
        password: null,
        email_send_info: {}
      },
      typeUser: [],
      profUser: []
    }
  },
  methods: {
    initEmailSendInfo(){
      const options = this.emailOptions
      if(!this.user.email_send_info || typeof this.user.email_send_info !== 'object'){
        this.user.email_send_info = {}
      }
      options.forEach(opt => {
        if(!(opt.key in this.user.email_send_info)){
          this.$set ? this.$set(this.user.email_send_info, opt.key, false) : (this.user.email_send_info[opt.key] = false)
        }
      })
      // Удаляем лишние ключи, не относящиеся к текущему типу формы
      Object.keys(this.user.email_send_info).forEach(k => {
        if(!options.find(o => o.key === k)){
          delete this.user.email_send_info[k]
        }
      })
    },
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
            this.initEmailSendInfo()
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
  computed: {
    emailOptions(){
      // Конфигурация типов рассылок
      const adminOptions = [
          { key: 'claim_update_state', label: 'Обновление статуса заявки' },
          { key: 'claim_create', label: 'Создание заявки' },
          { key: 'proposals_add', label: 'Создание нового предложения' },
      ]
      const workerOptions = [
        { key: 'claim_update_state', label: 'Обновление статуса заявки' },
      ]
      
      return this.typeUserForm !== 'worker' ? adminOptions : workerOptions
    },

    emailFieldTitle(){
      return this.typeUserForm !== 'worker' ? 'Настройки рассылок (админ)' : 'Настройки рассылок'
    },
    
    selectedEmailKeys: {
      get(){
        if(!this.user.email_send_info || typeof this.user.email_send_info !== 'object') return []
        const allowed = new Set(this.emailOptions.map(o => o.key))
        return Object.keys(this.user.email_send_info)
            .filter(k => allowed.has(k) && this.user.email_send_info[k] === true)
      },
      set(newKeys){
        this.initEmailSendInfo()
        const allowed = new Set(this.emailOptions.map(o => o.key))
        // Сбрасываем все текущие допустимые ключи в false
        this.emailOptions.forEach(o => { this.user.email_send_info[o.key] = false })
        // Устанавливаем true для выбранных
        newKeys.forEach(k => { if(allowed.has(k)) this.user.email_send_info[k] = true })
      }
    }
  },
  mounted() {
    this.loadType()
    this.loadProf()
    this.getUser()
    this.initEmailSendInfo()
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
            :disabled="typeUserForm === 'worker'"

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
            :disabled="typeUserForm === 'worker'"
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
      <v-col cols="12" md="12">
        <v-select
            :items="emailOptions"
            item-title="label"
            item-value="key"
            v-model="selectedEmailKeys"
            :label="emailFieldTitle"
            multiple
            chips
            closable-chips
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