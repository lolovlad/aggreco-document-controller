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
      :page="page"
      :headers="headers"
      :items="users"
      :items-length="totalItems"
      :loading="loading"
      item-value="uuid"
      @update:options="loadItem"
      :items-per-page-options="[
          {value: 20, title: '20'},
          {value: 40, title: '40'},
          {value: 100, title: '100'},
      ]"
      :items-per-page-text="'Количество элементов'"
      :loading-text="'Закгрузка данных'"
      :no-data-text="'Данных не обнаружено'"
  >
    <template v-slot:[`item.actions`]="{ item }">
      <delete-button @agree="deleteUser(item.uuid)" />
      <edit-button @click="updateUser(item.uuid)" />
    </template>
  </v-data-table-server>
  </v-card>
</template>

<script>

import UserService from "@/store/user.service";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import EditButton from "@/components/UI/Buttons/EditButton.vue";
import {page as $store} from "@/store/page.model";

export default {
  name: "CustomUserTable",
  components: {EditButton, DeleteButton},
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
        { title: 'Почта', key: 'email', align: 'start', sortable: false, value: item => {
            if(item.email === null)
              return "Нет"
            return item.email
          }
        },
        { title: 'Роль', key: 'type', align: 'start', sortable: false, value: item => `${item.type.name}` },
        { title: 'Должность', key: 'profession', align: 'start', sortable: false, value: item => {
              if(item.profession === null)
                return "Нет"
              return item.profession.description
            }
          },
        { title: 'Действия', key: "actions", sortable: false, align: 'center' }
      ],
      users: [],
      totalItems: 0,
      loading: true,
      search: '',
      page: 1,

      pageNow: 1,
      itemsPerPageNow: 20
    }
  },
  methods: {
    loadItem({page=1, itemsPerPage=20}){
      if(this.search.length === 0){
        const initialState = $store.state;
        if(initialState.nameTable === "user"){
          page = initialState.pageNow
          itemsPerPage = initialState.perItemPage
          this.$store.dispatch('page/dropState')
        }
        UserService.getPageUser(page, itemsPerPage).then(
            response => {
              this.page = page
              this.users = response.data
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false

              this.pageNow = page
              this.itemsPerPageNow = itemsPerPage
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
    saveState(){
      this.$store.dispatch('page/saveState', {name: "user", page: this.pageNow, perItemPage: this.itemsPerPageNow})
    },
    updateUser(uuid){
      this.saveState()

      this.$emit("updateUser", uuid)
    },
    deleteUser(uuid){
      this.saveState()

      this.$emit("deleteUser", uuid)
    },
  },
  watch: {
    search(){
      this.loadItem({page: 1, itemsPerPage: 20})

    }
  },
  mounted() {
    const initialState = $store.state;
    if(initialState.nameTable === "user"){
      this.loadItem({page: initialState.pageNow, itemsPerPage: initialState.perItemPage})
      this.$store.dispatch('page/dropData')
    }
  }

}
</script>

<style scoped>
</style>