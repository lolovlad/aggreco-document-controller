<script>
import ProposalsService from "@/store/proposals.service";
import ProposalsTable from "@/components/Tabels/ProposalsTable.vue";

export default {
  name: "ProposalsViewAdminPage",
  components: {ProposalsTable},
  methods: {
    editClaim() {
      this.$refs.proposalsTable.loadItem({page: 1, itemsPerPage: 20})
    },
    deleteProposals(uuidEntity) {
      ProposalsService.deleteEntity(uuidEntity).then(() => {
        this.$refs.proposalsTable.loadItem({page: 1, itemsPerPage: 20})
      })
    },
    approveProposal(uuid, comment) {
      console.log('Одобрение предложения:', uuid, comment)
      const form = {
        "name": null,
        "offer": null,
        "additional_material": null,
        "comment": comment,
        "is_agree": true
      }
      ProposalsService.updateEntity(uuid, form).then(() => {
        this.$refs.proposalsTable.loadItem({page: 1, itemsPerPage: 20})
      }).catch(error => {
        console.error('Ошибка при одобрении предложения:', error)
      })
    },
    rejectProposal(uuid, comment) {
      console.log('Отклонение предложения:', uuid, comment)
      const form = {
        "name": null,
        "offer": null,
        "additional_material": null,
        "comment": comment,
        "is_agree": false
      }
      ProposalsService.updateEntity(uuid, form).then(() => {
        this.$refs.proposalsTable.loadItem({page: 1, itemsPerPage: 20})
      }).catch(error => {
        console.error('Ошибка при отклонении предложения:', error)
      })
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <proposals-table @edit="editClaim"
                       @delete="deleteProposals"
                       @approve="approveProposal"
                       @reject="rejectProposal"
                       ref="proposalsTable"/>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>