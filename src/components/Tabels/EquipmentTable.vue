<template>
  <v-card
      title="Оборудование"
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
        :page="page"

        :items-per-page-options="[
          {value: 20, title: '20'},
          {value: 40, title: '40'},
          {value: 100, title: '100'}
        ]"
        :items-per-page-text="'Количество элементов'"
        :loading-text="'Закгрузка данных'"
        :no-data-text="'Данных не обнаружено'"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <edit-button @click="updateEquipment(item.uuid)"/>
        <delete-button @agree="deleteEquipment(item.uuid)"/>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import ObjectService from "@/store/object.service";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import {page as $store} from "@/store/page.model";
import EditButton from "@/components/UI/Buttons/EditButton.vue";

export default {
  name: "EquipmentTable",
  components: {EditButton, DeleteButton},
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
        { title: 'Описание', align: 'start', sortable: false, key: 'description', value: item => {
          if(item.description === null)
            return "Нет"
          return item.description
          }
        },
        { title: 'Действия', align: 'center', sortable: false, key: 'actions'},
      ],
      equipment: [],
      itemsPerPage: 20,
      page: 1,
      totalItems: 0,
      loading: false,

      pageNow: 1,
      itemsPerPageNow: 20
    }
  },
  methods: {
    loadItem({page=1, itemsPerPage=20}){
      this.loading = true
      if(this.search.length === 0){
        const initialState = $store.state;
        if(initialState.nameTable === `equipment_${this.uuidObject}`){
          page = initialState.pageNow
          itemsPerPage = initialState.perItemPage
          this.$store.dispatch('page/dropState')
        }
        ObjectService.getEquipmentPage(this.uuidObject, page, itemsPerPage)
            .then(response => {
              this.page = page
              this.equipment = response.data
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false

              this.pageNow = page
              this.itemsPerPageNow = itemsPerPage
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
    },
    saveState(){
      this.$store.dispatch('page/saveState', {name: `equipment_${this.uuidObject}`, page: this.pageNow, perItemPage: this.itemsPerPageNow})
    },
    updateEquipment(uuid){
      this.saveState()
      this.$emit('update', uuid)
    },
    deleteEquipment(uuid){
      this.saveState()
      this.$emit('delete', uuid)
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