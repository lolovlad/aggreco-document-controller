<template>
  <v-card
      title="Объекты"
      flat
  >
    <!--<template v-slot:text>
      <v-text-field
          v-model="search"
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
      ></v-text-field>
    </template>-->

    <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="objects"
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
        <v-icon
            class="me-2"
            size="small"
            @click="updateObject(item.uuid)"
        >
          mdi-pencil
        </v-icon>
        <delete-button @agree="deleteObject(item.uuid)"/>
      </template>
    </v-data-table-server>
  </v-card>

</template>

<script>
import ObjectService from "@/store/object.service";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";

export default {
  name: "ObjectTable",
  components: {DeleteButton},
  data(){
    return {
      search: "",
      itemsPerPage: 20,
      headers: [
        { title: 'Название', align: 'start', sortable: false, key: 'name'},
        { title: 'Адрес', align: 'start', sortable: false, key: 'address'},
        { title: 'Контрагент', align: 'start', sortable: false, key: 'counterparty'},
        { title: 'Состояние', align: 'start', sortable: false, key: 'state', value: item => `${item.state.description}`},
        { title: 'Действия', align: 'center', sortable: false, key: 'actions'},
      ],
      objects: [],
      totalItems: 0,
      loading: false,
    }
  },
  methods: {
    loadItem({page=1}){
      this.loading = true
      if(this.search.length === 0){
        ObjectService.getPageObject(page)
            .then(response => {
              this.objects = response.data
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false
            })
            .catch(
            (response) => {
              console.log(response)
            }
        )
      }
    },
    updateObject(uuid){
      this.$emit("updateObject", uuid)
    },
    deleteObject(uuid){
      this.$emit("deleteObject", uuid)
    },
  },
}
</script>

<style scoped>

</style>