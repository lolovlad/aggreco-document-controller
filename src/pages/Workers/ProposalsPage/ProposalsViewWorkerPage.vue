<script>
import ProposalsService from "@/store/proposals.service";
import ProposalsTable from "@/components/Tabels/ProposalsTable.vue";
import AddProposalsForm from "@/components/Forms/Main/AddProposalsForm.vue";

export default {
  name: "ProposalsViewWorkerPage",
  components: {AddProposalsForm, ProposalsTable},
  methods: {
    editClaim() {
      this.$refs.proposalsTable.loadItem({page: 1, itemsPerPage: 20})
    },
    deleteProposals(uuidEntity) {
      ProposalsService.deleteEntity(uuidEntity).then(() => {
        this.$refs.proposalsTable.loadItem({page: 1, itemsPerPage: 20})
      })
    },
    updateTable(){
      this.$refs.proposalsTable.loadItem({page: 1, itemsPerPage: 20})
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <proposals-table @edit="editClaim"
                       @delete="deleteProposals"
                       ref="proposalsTable"/>
    </v-col>
  </v-row>
  <add-proposals-form @save="updateTable"/>
</template>

<style scoped>

</style>