<template>
  <v-container>
    <button-back/>
    <v-row>
      <v-col cols="12" md="12">
        <EquipmentTable
            :uuidObject="idObject"
            @update="updateEquipment"
            @delete="deleteEquipment"
            ref="equipmentTable"

        />
      </v-col>
    </v-row>
  </v-container>
  <FixedButton @click="openAddEquipPage"/>
</template>

<script>
import EquipmentTable from "@/components/Tabels/EquipmentTable";
import FixedButton from "@/components/UI/FixedButton";
import ObjectService from "@/store/object.service";
import ButtonBack from "@/components/UI/ButtonBack.vue";
export default {
  name: "ViewEquipmentAdminPage",
  components: {ButtonBack, FixedButton, EquipmentTable},
  data(){
    return{
      idObject: this.$route.params.uuid,
      dialogDelete: false
    }
  },
  methods:{
    updateEquipment(uuid){
      this.$router.push(`/admin/object/${this.idObject}/equip/edit/${uuid}`)
    },
    deleteEquipment(uuid){
      ObjectService.deleteEquipment(uuid)
          .then(()=>{
            this.$refs.equipmentTable.loadItem({page: 1, itemsPerPage: 20})
          })
    },
    openAddEquipPage(){
      this.$refs.equipmentTable.saveState()
      this.$router.push(`/admin/object/${this.idObject}/equip/add`)
    }
  }
}
</script>

<style scoped>

</style>