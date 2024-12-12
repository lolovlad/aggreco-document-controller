<template>
  <v-container>
    <v-row>
      <v-alert
          density="compact"
          :text="error"
          title="Ошибка"
          type="warning"
          v-if="error !== null"
      />
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <EditEquipmentFrom
            :add-mode="addMode"
            :id-object="idObject"
            :id-equipment="idEquipment"
            @add="addEquipment"
            @update="updateEquipment"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EditEquipmentFrom from "@/components/Forms/EditEquipmentFrom";
import ObjectService from "@/store/object.service";

export default {
  name: "EditEquipmentPage",
  components: {EditEquipmentFrom},
  data(){
    return{
      idObject: this.$route.params.uuid,
      idEquipment: this.$route.params.uuid_equip,
      addMode: (this.$route.params.uuid_equip === undefined),
      error: null
    }
  },
  methods:{
    addEquipment(obj){
      ObjectService.addEquipment(this.idObject, obj)
          .then(() => {
            this.$router.go(-1)
          })
          .catch((message) => {
            this.error = message
          })
    },
    updateEquipment(obj, uuid){
      ObjectService.updateEquipment(uuid, obj)
          .then(()=>{
            this.$router.go(-1)
          })
          .catch((message) => {
            this.error = message
          })
    }
  }
}
</script>

<style scoped>

</style>