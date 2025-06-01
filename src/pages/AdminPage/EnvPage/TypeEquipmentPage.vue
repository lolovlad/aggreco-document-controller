<script>
import EnvService from "@/store/env.service";
import ExportCsvForm from "@/components/Forms/ExportCsvForm.vue";
import EditTypeEquipmentForm from "@/components/Forms/EnvForm/EditTypeEquipmentForm.vue";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";

export default {
  name: "TypeEquipmentPage",
  components: {DeleteButton, EditTypeEquipmentForm, ExportCsvForm},
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
            this.typeEquipment = typeEquipment
          }
      )
    },
    deleteEquipment(idEquip){
      EnvService.deleteTypeEquipment(idEquip).then(() => {
            this.loadTypeEquipment()
      })
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
            <delete-button @agree="deleteEquipment(item.id)"/>
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>