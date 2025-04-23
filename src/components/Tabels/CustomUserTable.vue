<template>
  <v-card
      title="Пользователи"
      flat
  >
    <template v-slot:text>
      <v-text-field
          v-model="search"
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
      ></v-text-field>
    </template>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="users"
      :items-length="totalItems"
      :loading="loading"
      item-value="uuid"
      @update:options="loadItem"
      :items-per-page-options="[
          {value: -1, title: '$vuetify.dataFooter.itemsPerPageAll'}
      ]"
      :items-per-page-text="'Количество элементов'"
      :loading-text="'Закгрузка данных'"
      :no-data-text="'Данных не обнаружено'"
  >
    <template v-slot:[`item.actions`]="{ item }">
      <delete-button
          @agree="deleteUser(item.uuid)"
      />
      <v-icon
          class="me-2"
          size="small"
          @click="updateUser(item.uuid)"
      >
        mdi-pencil
      </v-icon>
    </template>
  </v-data-table-server>
  </v-card>
</template>

<script>

import UserService from "@/store/user.service";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";

export default {
  name: "CustomUserTable",
  components: {DeleteButton},
  data(){
    return{
      itemsPerPage: 20,
      headers: [
        { title: 'ФИО', align: 'start', sortable: false, key: 'name',  value: item => {
            if(item.name !== null)
              return `${item.surname} ${item.name[0]}. ${item.patronymic[0]}.`
            return "Нет"
          }
        },
        { title: 'Почта', key: 'email', align: 'start', value: item => {
            if(item.email === null)
              return "Нет"
            return item.email
          }
        },
        { title: 'Роль', key: 'type', align: 'start', value: item => `${item.type.name}` },
        { title: 'Должность', key: 'profession', align: 'start', value: item => {
              if(item.profession === null)
                return "Нет"
              return item.profession.description
            }
          },
        { title: 'Действия', key: "actions", align: 'center' }
      ],
      users: [],
      totalItems: 0,
      loading: true,
      search: '',
    }
  },
  methods: {
    loadItem({page}){
      this.loading = true
      if(this.search.length === 0){
        UserService.getPageUser(page).then(
            response => {
              this.users = response.data
              console.log(this.users)
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false
            }
        ).catch(
            (response) => {
              console.log(response)
            }
        )
      }else{
        UserService.searchUsers(this.search).then(
            response => {
              this.users = response.data
              this.loading = false
            }
        ).catch(
            (response) => {
              console.log(response)
            }
        )
      }
    },
    updateUser(uuid){
      this.$emit("updateUser", uuid)
    },
    deleteUser(uuid){
      this.$emit("deleteUser", uuid)
    },
  },
  watch: {
    search(){
      this.loadItem(1)

    }
  }

}
</script>

<style scoped>
</style>