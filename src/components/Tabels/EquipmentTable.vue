<template>
  <v-card
      title="Оборудованние"
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
        :headers="headers"
        :items="equipment"
        :loading="loading"
        item-value="uuid"
        v-model:items-per-page="itemsPerPage"
        :items-length="totalItems"
        @update:options="loadItem"

        :items-per-page-options="[
          {value: -1, title: '$vuetify.dataFooter.itemsPerPageAll'}
      ]"
        :items-per-page-text="'Количество элементов'"
        :loading-text="'Закгрузка данных'"
        :no-data-text="'Данных не обнаружено'"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            class="me-2"
            size="small"
            @click="$emit('update', item.uuid)"
        >
          mdi-pencil
        </v-icon>
        <delete-button @agree="$emit('delete', item.uuid)"/>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import ObjectService from "@/store/object.service";
import DeleteButton from "@/components/UI/DeleteButton.vue";

export default {
  name: "EquipmentTable",
  components: {DeleteButton},
  props: {
    uuidObject: null
  },
  data(){
    return{
      search: "",
      headers: [
        { title: 'Название', align: 'start', sortable: false, key: 'name'},
        { title: 'Номер', align: 'start', sortable: false, key: 'code'},
        { title: 'Тип', align: 'start', sortable: false, key: 'type', value: item => `${item.type.name}`},
        { title: 'Описпание', align: 'start', sortable: false, key: 'description', value: item => {
          if(item.description === null)
            return "Нет"
          return item.description
          }
        },
        { title: 'Действия', align: 'center', sortable: false, key: 'actions'},
      ],
      equipment: [],
      itemsPerPage: 20,
      totalItems: 0,
      loading: false
    }
  },
  methods: {
    loadItem({page}){
      this.loading = true
      if(this.search.length === 0){
        ObjectService.getEquipmentPage(this.uuidObject, page)
            .then(response => {
              this.equipment = response.data
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false
            })
            .catch(
                (response) => {
                  console.log(response)
                }
            )
      }else{
        ObjectService.searchEquipmentInObject(this.uuidObject, this.search).then(
            response => {
              this.equipment = response
              this.loading = false
            }
        ).catch(
            (response) => {
              console.log(response)
            }
        )
      }
    }
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