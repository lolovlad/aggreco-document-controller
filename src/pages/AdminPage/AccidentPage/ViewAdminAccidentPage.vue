<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <AccidentTable @edit="editAccident" @information="infoAccident" ref="accidentTable"/>
      </v-col>
    </v-row>
    <AddAccidentForm @save="addAccident"/>
  </v-container>
</template>

<script>
import AccidentTable from "@/components/Tabels/AccidentTable";
import axios from "axios";
import AddAccidentForm from "@/components/Forms/AddAccidentForm";
import M from "materialize-css";
export default {
  name: "ViewAdminAccidentPage",
  components: {AddAccidentForm, AccidentTable},
  data(){
    return{
      items: [],
      numPage: 1,
      currentPage: 1,
      countItem: 20,
    }
  },
  methods: {
    addAccident(entity){
      axios
          .post('/accident', entity)
          .then((response) => {
            if(response.status >= 200){
              M.toast({html: response.data.message})
            }
          })
          .catch((response) => {
            console.log(response.data)
            M.toast({html: response.code})
          })
    },
    editAccident(uuidAccident){
      this.$router.push(`accident/edit/${uuidAccident}`)
    },
    infoAccident(uuidAccident){
      this.$router.push(`/accident/${uuidAccident}`)
    }
  }
}
</script>

<style scoped>

</style>