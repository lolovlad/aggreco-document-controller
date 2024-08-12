<template>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="equip.name"
            label="Название"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
            type="text"
            v-model="equip.code"
            label="Номер"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-select
            v-model="equip.id_type"
            :items="typeEquip"
            item-title="name"
            item-value="id"
            label="Тип"
            variant="underlined"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-textarea
            v-model="equip.description"
            variant="underlined"
            label="Описание"
            auto-grow
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-if="addMode">
        <ButtonAgrea @click="addEquipment">Сохранить</ButtonAgrea>
      </v-col>
      <v-col cols="12" md="4" v-else>
        <ButtonAgrea @click="updateEquipment">Обновить</ButtonAgrea>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import ButtonAgrea from "@/components/UI/ButtonAgrea";
import ObjectService from "@/store/object.service";

export default {
  name: "EditEquipmentFrom",
  components: {ButtonAgrea},
  props: {
    addMode: {
      type: Boolean,
      default: true
    },
    idObject: {
      type: String,
      default: null
    },
    idEquipment: {
      type: String,
      default: null
    }
  },
  data(){
    return{
      equip: {
        name: null,
        id_type: null,
        description: null,
        code: null
      },
      typeEquip: []
    }
  },
  methods: {
    loadType(){
      ObjectService.getTypeEquipment()
          .then((types) => {
            this.typeEquip = types
          })
    },

    getEquipment(){
      ObjectService.getEquipmentByUuid(this.idEquipment)
          .then((equipment) => {
            this.equip.name = equipment.name
            this.equip.id_type = equipment.id_type
            this.equip.description = equipment.description
            this.equip.code =equipment.code
          })
    },

    addEquipment(){
      this.$emit("add", this.equip)
    },
    updateEquipment(){
      this.$emit("update", this.equip, this.idEquipment)
    },

  },
  mounted() {
    this.loadType()
    if(this.addMode === false){
      this.getEquipment()
    }
  }
}
</script>

<style scoped>

</style>