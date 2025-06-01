<template>
  <v-container>
    <button-back/>
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
import ButtonBack from "@/components/UI/ButtonBack.vue";

export default {
  name: "EditEquipmentPage",
  components: {ButtonBack, EditEquipmentFrom},
  data(){
    return{
      idObject: this.$route.params.uuid,
      idEquipment: this.$route.params.uuid_equip,
      addMode: (this.$route.params.uuid_equip === undefined),
    }
  },
  methods:{
    addEquipment(obj){
      ObjectService.addEquipment(this.idObject, obj)
          .then(() => {
            this.$router.go(-1)
          })
    },
    updateEquipment(obj, uuid){
      ObjectService.updateEquipment(uuid, obj)
          .then(()=>{
            this.$router.go(-1)
          })
    }
  }
}
</script>

<style scoped>

</style>