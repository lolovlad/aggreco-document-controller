<script>
import ClaimTable from "@/components/Tabels/ClaimTable.vue";
import AddAccidentForm from "@/components/Forms/AddAccidentForm.vue";
import ClaimService from "@/store/claim.service";

export default {
  name: "ClaimViewPage",
  components: {AddAccidentForm, ClaimTable},
  data(){
    return{
      snackbar: false,
      message: "",

    }
  },
  methods: {
    editClaim(uuidClaim){
      this.$router.push(`claim/edit/${uuidClaim}`)
    },
    deleteClaim(uuidClaim){
      ClaimService.deleteClaim(uuidClaim).then(()=>{
        this.snackbar = true
        this.message = "Заявка удалена"
        this.$refs.claimTable.loadItem(1)
      })
    },
    updateStateClaim(uuidClaim){
      ClaimService.updateStateClaim(uuidClaim, 'under_consideration')
      .then(() => {
        this.snackbar = true
        this.message = "Заявка отправлена на расмотрение"
        this.$refs.claimTable.loadItem(1)
      })
    },
    downgradeStateClaim(uuidClaim){
      ClaimService.updateStateClaim(uuidClaim, 'draft')
          .then(() => {
            this.snackbar = true
            this.message = "Вы отозвали заявку"
            this.$refs.claimTable.loadItem(1)
          })
    },
    saveClaim(accident){
      const claimModel = {
        accident: accident,
        datetime: new Date().getTime(),
        main_document: null,
        edit_document: null,
        comment: ""
      }
      this.$refs.claimTable.saveState()
      ClaimService.addClaim(claimModel).then(() => {
        this.snackbar = true
        this.message = "Заявка добавлена"
        this.$refs.claimTable.loadItem()
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
                   ref="claimTable"/>
    </v-col>
  </v-row>
  <add-accident-form :title="'Добавить Заявку'" @save="saveClaim"/>
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>