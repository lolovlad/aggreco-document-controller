<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <EquipmentTable
            :uuidObject="idObject"
            @update="updateEquipment"
            @delete="dialogDelete = true"
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

  <v-dialog
      v-model="dialogDelete"
      max-width="500"
      persistent
  >
    <v-card
        prepend-icon="mdi-close"
        text="При согласиии объект будет удален"
        title="Вы действиетльно хотите удалить объект?"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialogDelete = false">
          Отмена
        </v-btn>

        <v-btn @click="deleteEquipment">
          Подтвердить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <FixedButton @click="openAddEquipPage"/>
</template>

<script>
import EquipmentTable from "@/components/Tabels/EquipmentTable";
import FixedButton from "@/components/UI/FixedButton";
import ObjectService from "@/store/object.service";
export default {
  name: "ViewEquipmentAdminPage",
  components: {FixedButton, EquipmentTable},
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
            this.$refs.equipmentTable.loadItem(1)
          })
    },
    openAddEquipPage(){
      this.$router.push(`/admin/object/${this.idObject}/equip/add`)
    }
  }
}
</script>

<style scoped>

</style>