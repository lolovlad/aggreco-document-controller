<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <AccidentTable @edit="editAccident" @information="infoAccident" ref="accidentTable"/>
      </v-col>
    </v-row>
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