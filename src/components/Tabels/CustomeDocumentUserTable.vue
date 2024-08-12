<template>
  <v-card
      title="Просмотренные пользователи"
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
      />
    </template>
    <v-data-table-server
        :headers="headers"
        :items="users"
        :loading="loading"
        item-value="user.uuid"
        hide-default-footer
        @update:options="loadItem"
    />
  </v-card>
  <!--<table>
    <thead>
    <tr>
      <th>Почта</th>
      <th>Роль</th>
      <th>Дата просмотра</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="docUser in documentUsers" :key="docUser.user.uuid">
      <td>{{docUser.user.email}}</td>
      <td>{{docUser.user.type.name}}</td>
      <data-time-view-cell :dataTime="docUser.datetime_view"/>
    </tr>
    </tbody>
  </table>-->
</template>

<script>
import moment from "moment/moment";
import UserService from "@/store/user.service";
import documentService from "@/store/document.service";

export default {
  name: "CustomeDocumentUserTable",
  props:{
    uuidDocument: null
  },
  data(){
    return{
      search: "",
      itemsPerPage: 0,
      headers: [
        { title: 'ФИО', align: 'start', sortable: false, key: 'user.name',  value: item => {
            if(item.user.name !== null)
              return `${item.user.surname} ${item.user.name[0]}. ${item.user.patronymic[0]}.`
            return "Нет"
          }
        },
        { title: 'Почта', align: 'start', sortable: false, key: 'user.email' },
        { title: 'Дата просмотра', align: 'start', sortable: false, key: 'datetime_view', value: item => {
            let dateNew = new Date(item.datetime_view)
            return moment(dateNew).format('DD.MM.YYYY HH:mm')
          }
        },
        { title: 'Роль', align: 'start', sortable: false, key: 'user.type.name' },
      ],
      users: [],
      totalItems: 10,
      loading: true,
    }
  },
  methods: {
    loadItem(){
      this.loading = true
      if(this.search.length === 0){
        documentService.getViewUsersDocument(this.uuidDocument).then(
            response => {
              this.users = response
              this.totalItems = this.users.length
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
  }
}
</script>

<style scoped>

</style>