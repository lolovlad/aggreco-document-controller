<script>
import ProfessionalTable from "@/components/Tabels/ProfessionalTable.vue";
import EditProfessionForm from "@/components/Forms/EditProfessionForm.vue";
import EnvService from "@/store/env.service";

export default {
  name: "ProfessionPage",
  components: {EditProfessionForm, ProfessionalTable},
  data: () => ({
    errorMessage: null,
  }),
  methods: {
    updateTable(){
      this.$refs.profTable.loadItem()
    },
    deleteProf(id_prof){
      EnvService.deleteProf(id_prof)
          .then(response => {
        console.log(response)
        this.$refs.profTable.loadItem()
      })
          .catch(error => {
            this.errorMessage = error.response.data.message;
          })
    }
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4">
        <EditProfessionForm :add-mode="true" @addProf="updateTable"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <ProfessionalTable ref="profTable" @deleteProf="deleteProf"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>