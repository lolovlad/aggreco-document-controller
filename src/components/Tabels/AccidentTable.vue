<template>
  <v-card
      title="Аварийныйе остановки"
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
        :items="items"
        :headers="headers"
        v-model:items-per-page="itemsPerPage"
        :items-length="totalItems"
        :loading="loading"
        :page="page"
        :items-per-page-options="[
          {value: 20, title: '20'},
          {value: 40, title: '40'},
          {value: 100, title: '100'},
      ]"
        item-value="uuid"
        @update:options="loadItem"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <delete-button @agree="deleteAccident(item)"/>
        <edit-button @click="editAccident(item)"/>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import UserService from "@/store/user.service";
import AccidentService from "@/store/accident.service";
import moment from "moment/moment";
import EditButton from "@/components/UI/Buttons/EditButton.vue";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import {page as $store} from "@/store/page.model";

export default {
  name: "AccidentTable",
  components: {DeleteButton, EditButton},
  data(){
    return{
      headers: [
        { title: 'Объект', key: 'object', value: item => `${item.object.name}`},
        { title: 'Время', key: 'datetime_start', sortable: false, value: item => {
            let dateNew = new Date(item.datetime_start)
            return moment(dateNew).format('DD.MM.YYYY HH:mm')
          }
        },
        { title: 'Время конца', key: 'datetime_end', sortable: false, value: item => {
              let dateNew = new Date(item.datetime_end)
              return moment(dateNew).format('DD.MM.YYYY HH:mm')
          }
        },
        { title: 'Поврежденное оборудованние', key: 'damaged_equipment', value: item => {
            if(item.damaged_equipment.length > 0){
              return item.damaged_equipment.map((item) => item.name).join(",")
            }
            return "Нет"
          }
        },
        {title: 'Действия', key: "actions"}
      ],
      items: [],
      totalItems: 0,
      loading: true,
      search: '',
      itemsPerPage: 20,
      page: 1,
      pageNow: 1,
      itemsPerPageNow: 20
    }
  },
  methods: {
    deleteAccident(item){
      this.saveState()
      this.$emit("delete", item.uuid)
    },
    editAccident(item){
      this.saveState()
      this.$emit("edit", item.uuid)
    },
    infoAccident(item){
      this.$emit("information", item.uuid)
    },
    loadItem({page=1, itemsPerPage=20}){
      this.loading = true
      if(this.search.length === 0){
        const initialState = $store.state;
        if(initialState.nameTable === "accident"){
          page = initialState.pageNow
          itemsPerPage = initialState.perItemPage
          this.$store.dispatch('page/dropState')
        }
        AccidentService.getPageAccident(page, itemsPerPage).then(
            response => {
              this.page = page
              this.items = response.data
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
              //this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              //this.itemsPerPage = parseInt(response.headers["x-count-item"])
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
      this.$store.dispatch('page/saveState', {name: "accident", page: this.pageNow, perItemPage: this.itemsPerPageNow})
    },
  }
}
</script>

<style scoped>

</style>