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
        item-value="uuid"
        @update:options="loadItem"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            class="me-2"
            size="small"
            @click="deleteAccident(item)"
        >
          mdi-delete
        </v-icon>
        <v-icon
            class="me-2"
            size="small"
            @click="editAccident(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            class="me-2"
            size="small"
            @click="infoAccident(item)"
        >
          mdi-information
        </v-icon>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import UserService from "@/store/user.service";
import AccidentService from "@/store/accident.service";
import moment from "moment/moment";

export default {
  name: "AccidentTable",
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
    }
  },
  methods: {
    deleteAccident(item){
      this.$emit("delete", item.uuid)
    },
    editAccident(item){
      this.$emit("edit", item.uuid)
    },
    infoAccident(item){
      this.$emit("information", item.uuid)
    },
    loadItem({page}){
      this.loading = true
      if(this.search.length === 0){
        AccidentService.getPageAccident(page).then(
            response => {
              this.items = response.data
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
  }
}
</script>

<style scoped>

</style>