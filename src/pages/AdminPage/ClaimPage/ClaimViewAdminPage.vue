<script>
import ClaimTable from "@/components/Tabels/ClaimTable.vue";
import ClaimService from "@/store/claim.service";

export default {
  name: "ClaimViewAdminPage",
  components: {ClaimTable},
  data(){
    return{
    }
  },
  methods: {
    editClaim(uuidClaim) {
      this.$router.push(`claim/edit/${uuidClaim}`)
    },
    deleteClaim(uuidClaim) {
      ClaimService.deleteClaim(uuidClaim).then(() => {
        this.$refs.claimTable.loadItem({page: 1, itemsPerPage: 20})
      })
    },
    updateStateClaim(uuidClaim) {
      ClaimService.updateStateClaim(uuidClaim, 'accepted')
          .then(() => {
            this.$refs.claimTable.loadItem({page: 1, itemsPerPage: 20})
          })
    },
    downgradeStateClaim(uuidClaim){
      ClaimService.updateStateClaim(uuidClaim, 'under_development')
          .then(() => {
            this.$refs.claimTable.loadItem({page: 1, itemsPerPage: 20})
          })
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <claim-table @edit="editClaim"
                   @delete="deleteClaim"
                   @updateStateClaim="updateStateClaim"
                   @downgradeStateClaim="downgradeStateClaim"
                   :is-downgrade="true"
                   ref="claimTable"/>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>