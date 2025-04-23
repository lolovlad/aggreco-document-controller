<script>
import EnvService from "@/store/env.service";
import ExportCsvForm from "@/components/Forms/ExportCsvForm.vue";
import EditTypeEquipmentForm from "@/components/Forms/EnvForm/EditTypeEquipmentForm.vue";

export default {
  name: "TypeEquipmentPage",
  components: {EditTypeEquipmentForm, ExportCsvForm},
  data(){
    return{
      headers: [
        {title: 'Название', key: 'name'},
        {title: 'Код', key: 'code'},
        {title: 'Описание', key: 'description'},
        {title: 'Управление', key: 'actions'}
      ],
      typeEquipment: []
    }
  },
  methods: {
    loadTypeEquipment(){
      EnvService.getTypeEquipment().then(
          (typeEquipment) => {
            console.log(typeEquipment)
            this.typeEquipment = typeEquipment
          }
      )
    },
    exportCsvFile(file){
      let form = new FormData()
      if (file !== null)
        form.append("file", this.file)
        EnvService.exportTypeEquipmentFile(form).then(
            this.$refs.exportCsvForm.clearForm()
        )
    },
  },
  mounted() {
    this.loadTypeEquipment()
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="auto">
        <export-csv-form @export="exportCsvFile" ref="exportCsvForm"/>
      </v-col>
      <v-col cols="auto">
        <edit-type-equipment-form @addProf="loadTypeEquipment"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table-virtual
            :headers="headers"
            :items="typeEquipment"
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
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>