<template>
  <v-card
      title="Объекты"
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
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            class="me-2"
            size="small"
            @click="$emit('update', item.uuid)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            class="me-2"
            size="small"
            @click="$emit('delete', item.uuid)"
        >
          mdi-close
        </v-icon>
      </template>
    </v-data-table-server>
  </v-card>
  <!--<table>
    <thead>
    <tr>
      <th>Название</th>
      <th>Номер</th>
      <th>Тип</th>
      <th>Описпание</th>
      <th></th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="equ in equipments" :key="equ.uuid">
      <td>{{equ.name}}</td>
      <td>{{equ.code}}</td>
      <td>{{equ.type.description}}</td>
      <td>{{equ.description}}</td>
      <td>
        <div class="button-menu">
          <a class="waves-effect waves-light btn-small" @click="$emit('update', equ.uuid)">Редактировать</a>
          <ButtonDelete @click="deleteEquip(equ.uuid)" />
        </div>
      </td>
    </tr>
    </tbody>
  </table>-->
</template>

<script>
import ObjectService from "@/store/object.service";

export default {
  name: "EquipmentTable",
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
              console.log(response.data)
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
      }
    }
  }
}
</script>

<style scoped>

</style>