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
        :page="page"
        @update:options="loadItem"
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
        <v-icon
            class="me-2"
            size="small"
            @click="updateObject(item.uuid)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            class="me-2"
            size="small"
            @click="openSettings(item.uuid)"
            title="Настройки объекта"
        >
          mdi-cog
        </v-icon>
        <delete-button @agree="deleteObject(item.uuid)"/>
      </template>
    </v-data-table-server>
  </v-card>

  <ObjectSettingsForm
      :object-uuid="selectedObjectUuid"
      ref="settingsForm"
      @saved="handleSettingsSaved"
  />
</template>

<script>
import ObjectService from "@/store/object.service";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import ObjectSettingsForm from "@/components/Forms/ObjectSettingsForm.vue";
import {page as $store} from "@/store/page.model";

export default {
  name: "ObjectTable",
  components: {DeleteButton, ObjectSettingsForm},
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
      pageNow: 1,
      itemsPerPageNow: 20,
      page: 1,
      selectedObjectUuid: null
    }
  },
  methods: {
    loadItem({page=1, itemsPerPage=20}){
      this.loading = true
      if(this.search.length === 0){
        const initialState = $store.state;
        if(initialState.nameTable === "object"){
          page = initialState.pageNow
          itemsPerPage = initialState.perItemPage
          this.$store.dispatch('page/dropState')
        }
        ObjectService.getPageObject(page, itemsPerPage)
            .then(response => {
              this.page = page
              this.objects = response.data
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
      }
    },
    saveState(){
      this.$store.dispatch('page/saveState', {name: "object", page: this.pageNow, perItemPage: this.itemsPerPageNow})
    },
    updateObject(uuid){
      this.saveState()
      this.$emit("updateObject", uuid)
    },
    deleteObject(uuid){
      this.saveState()
      this.$emit("deleteObject", uuid)
    },
    openSettings(uuid){
      this.saveState()
      this.selectedObjectUuid = uuid
      if (this.$refs.settingsForm) {
        this.$refs.settingsForm.open()
      }
    },
    handleSettingsSaved(){
      // Можно перезагрузить данные таблицы, если нужно
      // this.loadItem({page: this.page, itemsPerPage: this.itemsPerPage})
    }
  },
}
</script>

<style scoped>

</style>