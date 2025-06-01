<script>
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import ExportCsvForm from "@/components/Forms/ExportCsvForm.vue";
import EnvService from "@/store/env.service";
import EditRegionForm from "@/components/Forms/EnvForm/EditRegionForm.vue";

export default {
  name: "RegionPage",
  components: {EditRegionForm, ExportCsvForm, DeleteButton},
  data(){
    return{
      headers: [
        {title: 'Название', key: 'name'},
        {title: 'Код', key: 'code'},
        {title: 'Управление', key: 'actions', sortable: false},
      ],
      region: []
    }
  },
  methods: {
    loadRegion(){
      EnvService.getRegion().then(
          (region) => {
            this.region = region
          }
      )
    },
    deleteRegion(idRegion){
      EnvService.deleteTypeEquipment(idRegion).then(() => {
        this.loadTypeEquipment()
      })
    },
    exportCsvFile(file){
      let form = new FormData()
      if (file !== null)
        form.append("file", this.file)
        EnvService.exportRegionFile(form).then(() => {
          this.$refs.exportCsvForm.clearForm()
        }
      )
    },
  },
  mounted() {
    this.loadRegion()
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
        <edit-region-form @addProf="loadRegion"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table-virtual
            :headers="headers"
            :items="region"
            hide-default-footer
        >
          <template v-slot:[`item.actions`]="{ item }">
            <delete-button @agree="deleteRegion(item.id)"/>
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>