<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <AccidentTable @edit="editAccident"
                       @information="infoAccident"
                       @delete="deleteAccident"
                       ref="accidentTable"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AccidentTable from "@/components/Tabels/AccidentTable";
import AccidentService from "@/store/accident.service";
export default {
  name: "ViewAdminAccidentPage",
  components: {AccidentTable},
  data(){
    return{
      drawel: false,
      snackbar: false,
      message: ""
    }
  },
  methods: {
    editAccident(uuidAccident){
      this.$router.push(`accident/edit/${uuidAccident}`)
    },
    infoAccident(uuidAccident){
      this.$router.push(`/accident/${uuidAccident}`)
    },
    deleteAccident(uuidAccident){
      AccidentService.deleteAccident(uuidAccident).then(()=>{
        this.message = "АО удалено"
        this.drawel = false
        this.$nextTick(()=>{
          this.snackbar = true
          this.$refs.accidentTable.loadItem({page: 1, itemsPerPage: 20})
        })
      })
    }
  }
}
</script>

<style scoped>

</style>