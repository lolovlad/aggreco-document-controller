<template>
  <v-card
    title="Документы"
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
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="documents"
        :items-length="totalItems"
        :loading="loading"
        item-value="uuid"
        @update:options="loadItem"
    >
      <template v-slot:[`item.actions`]="{ item }">

        <v-speed-dial
            location="left center"
            transition="fade-transition"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-icon
                v-bind="activatorProps"
            >mdi-dots-vertical</v-icon>
          </template>

          <v-btn key="1" icon @click="updateDoc(item.uuid)">
            <v-icon>
              mdi-pencil
            </v-icon>
            <v-tooltip
                activator="parent"
                location="end"
            >Обновить</v-tooltip>
          </v-btn>
          <v-btn key="2" icon @click="getUrl(item.uuid)">
            <v-icon>
              mdi-web
            </v-icon>
            <v-tooltip
                activator="parent"
                location="end"
            >Скопировать URL</v-tooltip>
          </v-btn>
          <v-btn key="3" icon @click="getUserToDocument(item.uuid)">
            <v-icon>
              mdi-account-multiple
            </v-icon>
            <v-tooltip
                activator="parent"
                location="end"
            >Статистика</v-tooltip>
          </v-btn>
          <v-btn key="4" icon @click="deleteDoc(item.uuid)">
            <v-icon>
              mdi-close
            </v-icon>
            <v-tooltip
                activator="parent"
                location="end"
            >Удалить</v-tooltip>
          </v-btn>
        </v-speed-dial>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import moment from 'moment'
import DocumentService from "@/store/document.service";
export default {
  name: "CustomDocumentTable",
  data(){
    return{
      itemsPerPage: 20,
      headers: [
        { title: 'Название', align: 'start', sortable: false, key: 'name' },
        { title: 'URL', align: 'start', sortable: false, key: 'url_document' },
        { title: 'Дата создания', align: 'start', sortable: false, key: 'data_create', value: item => {
            let dateNew = new Date(item.data_create)
            return moment(dateNew).format('DD.MM.YYYY HH:mm')
          }
        },
        { title: 'Описание', align: 'start', sortable: false, key: 'description' },
        { title: 'Действия', key: "actions", align: 'center' }
      ],
      documents: [],
      totalItems: 0,
      loading: false,
      search: ''
    }
  },
  methods: {
    loadItem({page}){
      this.loading = true
      if(this.search.length === 0){
        DocumentService.getPageDocument(page).then(
            response => {
              this.documents = response.data
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false
            }
        ).catch(
            (response) => {
              console.log(response)
            }
        )
      }
    },
    updateDoc(uuid){
      this.$emit("updateDoc", uuid)
    },
    deleteDoc(uuid){
      this.$emit("deleteDoc", uuid)
    },
    getUrl(uuid){
      this.$emit("getUrl", uuid)
    },
    getUserToDocument(uuid){
      this.$router.push(`/admin/document/users/${uuid}`)
    }
  },
  watch:{
    search(){
      this.loadItem(1)
    }
  }
}
</script>

<style scoped>

</style>