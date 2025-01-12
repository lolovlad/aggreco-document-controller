<script>
import BlueprintTable from "@/components/Tabels/BlueprintTable.vue";
import FixedButton from "@/components/UI/FixedButton.vue";

export default {
  name: "ViewBlueprinAdminPage",
  components: {FixedButton, BlueprintTable},
  methods: {
    deleteBlueprint(id){
      console.log(id)
    },

    editBlueprint(id){
      this.$router.push(`/admin/blueprint/edit/${id}`)
    }
  }
}
</script>

<template>
 <v-container>
   <v-row>
     <v-col cols="12" md="12">
       <BlueprintTable
           @delete="deleteBlueprint"
           @edit="editBlueprint"
       />
     </v-col>
   </v-row>
   <FixedButton @click="$router.push(`/admin/blueprint/add`)"/>
 </v-container>
</template>

<style scoped>

</style>