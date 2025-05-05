<script>
import ClaimTable from "@/components/Tabels/ClaimTable.vue";
import ClaimService from "@/store/claim.service";

export default {
  name: "ClaimViewAdminPage",
  components: {ClaimTable},
  data(){
    return{
      snackbar: false,
      message: ""
    }
  },
  methods: {
    editClaim(uuidClaim) {
      this.$router.push(`claim/edit/${uuidClaim}`)
    },
    deleteClaim(uuidClaim) {
      ClaimService.deleteClaim(uuidClaim).then(() => {
        this.snackbar = true
        this.message = "Заявка удалена"
        this.$refs.claimTable.loadItem({page: 1, itemsPerPage: 20})
      })
    },
    updateStateClaim(uuidClaim) {
      ClaimService.updateStateClaim(uuidClaim, 'accepted')
          .then(() => {
            this.snackbar = true
            this.message = "Заявка согласована"
            this.$refs.claimTable.loadItem({page: 1, itemsPerPage: 20})
          })
    },
    downgradeStateClaim(uuidClaim){
      ClaimService.updateStateClaim(uuidClaim, 'under_development')
          .then(() => {
            this.snackbar = true
            this.message = "Заявка отправлена на дороботку"
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
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>