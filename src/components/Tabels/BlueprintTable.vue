<script>
import moment from "moment/moment";
import fileDocumentService from "@/store/fileDocument.service";

export default {
  name: "BlueprintTable",
  data(){
    return{
      headers: [
        {title: 'Название', key: 'name'},
        {title: 'Дата редактирования', key: 'datetime', value: item => {
            let dateNew = new Date(item.datetime)
            return moment(dateNew).format('DD.MM.YYYY HH:mm')
          }},
        {title: 'Размер', key: 'size', value: item => {

            return `${item.size} МБ`}},
        {title: 'Управление', key: 'actions'}
      ],
      blueprint: []
    }
  },
  methods: {
    loadFiles(){
      fileDocumentService.getListFiles().then(
          (files) => {
            this.blueprint = files
          }
      )
    }
  },
  mounted() {
    this.loadFiles()
  }
}
</script>

<template>
  <v-card
      title="Шаблоны заявок"
      flat
  >
      <v-data-table
          :headers="headers"
          :items="blueprint"
          hide-default-footer
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
              size="small"
              @click="$emit('delete', item.id)"
          >
            mdi-delete
          </v-icon>
          <v-icon
              class="me-2"
              size="small"
              @click="$emit('edit', item.id)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
  </v-card>
</template>

<style scoped>

</style>