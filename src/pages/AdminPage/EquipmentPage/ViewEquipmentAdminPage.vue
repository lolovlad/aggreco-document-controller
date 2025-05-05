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
  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
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
      message: "",
      snackbar: false,
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
            this.message = "Объект удален"
            this.snackbar = true
            this.$refs.equipmentTable.loadItem()
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